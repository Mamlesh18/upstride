# API reference

The HTTP surface of a running MemDream server — for agents that are not written
in Python, and for anything the SDK does not wrap. A Python service should use
the [SDK](sdk.md)'s `DreamClient`, which covers every endpoint below.

```text
Base URL    http://localhost:8000          (your deployment's host)
Content     application/json
Auth        X-API-Key: sk_live_...          (when keys are configured)
```

An interactive OpenAPI explorer is served at `/docs` by every MemDream server.

**Conventions.** Request and response bodies are JSON with `camelCase` keys.
Timestamps are ISO-8601 with an offset (`2026-03-14T09:21:00Z`). Every response
carries an `X-Request-ID` header; send your own to correlate across systems, and
quote it when reporting a problem. List endpoints page with `limit` and `offset`.

---

## Authentication

Send an API key in the `X-API-Key` header:

```bash
curl https://memory.example.com/v1/memories?userId=user_123 \
  -H "X-API-Key: sk_live_..."
```

With no keys configured the API accepts every request — acceptable only on a
private network behind your own gateway. Keys are either **shared**
(`DREAM_API_KEYS`, and the caller names its own `clientId`) or **bound to a
client** (`DREAM_API_KEY_CLIENTS`, and the tenant comes from the key). For a
multi-tenant service, bind every key and set
`DREAM_API_KEY_REQUIRE_BINDING=true` — see
[Authentication](self-hosting.md#authentication).

A missing, invalid, or wrongly-bound key returns **401** with code
`unauthorized`.

---

## Scope

Every request identifies whose memory it touches. Send scope in the JSON body on
`POST`/`PATCH`, and as query parameters on `GET`/`DELETE`.

| Field | | |
|---|---|---|
| `userId` | string | the user. This or `phoneNumber` is **required** |
| `phoneNumber` | string | derive the user id from a phone number instead |
| `agentId` | string | which agent or bot |
| `clientId` | string | the tenant. Ignored if the API key is bound to one |
| `namespace` | object | further dimensions, e.g. `{"env": "prod"}` |
| `botId` | string | previous name for `agentId`, still accepted |

A request with no user returns **422**. Scope is not a post-filter: the vector
index is partitioned by it, so a memory outside the scope is not merely hidden —
it is not reachable.

---

## Memories

### POST /v1/memories

Remember a message. MemDream extracts the durable facts and decides what to do
with each one: `ADD`, `SUPERSEDE`, `MERGE` or `NOOP`.

| Field | | |
|---|---|---|
| `prompt` | string, **required** | the user's message, 1–20,000 characters |
| `messageId` | string | your id for the message, stored as provenance |
| `timestamp` | string | when the message was sent, if not now. Anchors phrases like *"last month"* |
| `metadata` | object | stored on the resulting memories and returned untouched |
| `raw` | boolean | store `prompt` verbatim as one memory instead of extracting facts. The decision still runs. Default `false` |

```bash
curl -X POST https://memory.example.com/v1/memories \
  -H "Content-Type: application/json" \
  -H "X-API-Key: sk_live_..." \
  -d '{
        "userId": "user_123",
        "prompt": "I live in Bangalore now.",
        "messageId": "msg_0042",
        "metadata": {"channel": "whatsapp"}
      }'
```

**200** — an [add result](#add-result):

```json
{
  "action": "SUPERSEDE",
  "memoryId": "mem_7c41d2a09b8e4f3a9d6b1e20",
  "supersededMemoryIds": ["mem_002e9cd0a9d94445bb4edad2"],
  "mergedMemoryIds": [],
  "extractedCount": 1,
  "results": [
    {
      "action": "SUPERSEDE",
      "memoryId": "mem_7c41d2a09b8e4f3a9d6b1e20",
      "content": "User lives in Bangalore.",
      "reason": "contradicts an existing location memory",
      "supersededMemoryIds": ["mem_002e9cd0a9d94445bb4edad2"],
      "mergedMemoryIds": [],
      "operationId": "op_51b0c7e8d2a94f61"
    }
  ]
}
```

A message with nothing durable in it returns `"action": "NOOP"` and an empty
`results` — and still writes an audit row saying why.

SDK: [`add`](sdk.md#add).

### POST /v1/memories/manual

Store a memory exactly as written — no extraction, no decision. For importing
facts you already know.

| Field | | |
|---|---|---|
| `content` | string, **required** | 1–4,000 characters. Write it in the third person: `"User is allergic to peanuts."` |
| `memoryType` | string | any string; default `other` |
| `importance` | number | 0–1, default `0.6` |
| `confidence` | number | 0–1, default `1.0` |
| `explicit` | boolean | `false` marks it inferred rather than stated. Default `true` |
| `temporalNature` | string | `permanent`, `current`, `temporary`, `historical` or `future`. Default `current` |
| `validFrom` `validUntil` | string | when the fact is true. Consolidation retires it after `validUntil` |
| `metadata` | object | |
| `allowDuplicate` | boolean | by default an identical active memory is returned instead of a second copy |

```bash
curl -X POST https://memory.example.com/v1/memories/manual \
  -H "Content-Type: application/json" \
  -d '{
        "userId": "user_123",
        "content": "User is allergic to peanuts.",
        "memoryType": "constraint",
        "importance": 0.95,
        "temporalNature": "permanent"
      }'
```

**200** — a [memory detail](#memory-detail). SDK: [`create`](sdk.md#create).

### POST /v1/memories/search

Find the memories that answer a question, hybrid-ranked over semantic
similarity, importance, recency and status.

| Field | | |
|---|---|---|
| `query` | string, **required** | 1–8,000 characters |
| `limit` | integer | 1–100, default `10` |
| `latestOnly` | boolean | only `active` memories — *"what is true now?"*. Overrides the `include*` flags |
| `includeSuperseded` | boolean | include replaced facts, ranked below current ones. Default `true` |
| `includeMerged` `includeExpired` | boolean | widen further. Default `false` |
| `memoryTypes` | string[] | e.g. `["preference", "constraint"]` |
| `minScore` | number | 0–1; drop weaker matches |
| `asOf` | string | only memories true at that instant — *"where did they live in March?"* |

```bash
curl -X POST https://memory.example.com/v1/memories/search \
  -H "Content-Type: application/json" \
  -d '{
        "userId": "user_123",
        "query": "what should I avoid cooking?",
        "latestOnly": true,
        "minScore": 0.4
      }'
```

**200**:

```json
{
  "count": 1,
  "memories": [
    {
      "memoryId": "mem_9eff9c243db54ffda6c75295",
      "content": "User is allergic to peanuts.",
      "memoryType": "constraint",
      "status": "active",
      "importance": 0.95,
      "confidence": 1.0,
      "score": 0.62,
      "scoreBreakdown": {"semantic": 0.71, "importance": 0.95, "recency": 0.40},
      "createdAt": "2026-03-01T10:12:44Z"
    }
  ]
}
```

SDK: [`search`](sdk.md#search).

### GET /v1/memories

Browse memories without a query, newest first.

| Parameter | | |
|---|---|---|
| `userId` | string, **required** | plus any other [scope](#scope) parameter |
| `limit` | integer | 1–200, default `50` |
| `offset` | integer | default `0` |
| `status` | string | repeatable. Default `active` |
| `memoryType` | string | repeatable |

```bash
curl "https://memory.example.com/v1/memories?userId=user_123&status=active&status=superseded&limit=200"
```

**200** — `{"count": 12, "memories": [ … ]}` of [memory objects](#memory).
SDK: [`list`](sdk.md#list).

### GET /v1/memories/{memoryId}

One memory with its relationships — what it supersedes, what it was merged from,
which patterns were derived from it.

```bash
curl "https://memory.example.com/v1/memories/mem_7c41d2a09b8e4f3a9d6b1e20?userId=user_123"
```

**200** — a [memory detail](#memory-detail). **404** if it does not exist *in
this scope*. SDK: [`get`](sdk.md#get).

### PATCH /v1/memories/{memoryId}

Correct an active memory in place. Only the fields you send change; the id stays
the same.

Updatable: `content`, `memoryType`, `importance`, `confidence`, `explicit`,
`temporalNature`, `validFrom`, `validUntil`, `metadata`.

```bash
curl -X PATCH https://memory.example.com/v1/memories/mem_9eff9c243db54ffda6c75295 \
  -H "Content-Type: application/json" \
  -d '{"userId": "user_123", "importance": 0.9, "metadata": {"verified": true}}'
```

An edit is a **correction**, not a change in the user's life, so it creates no
history. When the user's situation changes, `POST /v1/memories` instead and let
MemDream supersede.

**200** — a [memory detail](#memory-detail). **409** (`conflict`) for a
`superseded` or `merged` memory: history is never rewritten. SDK:
[`update`](sdk.md#update).

### DELETE /v1/memories/{memoryId}

Retire a memory, or erase it.

| Parameter | | |
|---|---|---|
| `userId` | string, **required** | |
| `permanent` | boolean | `true` deletes the row and its relationships. Cannot be undone. Default `false` |

By default the memory moves to `expired`: it leaves search results but stays
auditable. This is what *"forget that"* should do.

```bash
curl -X DELETE "https://memory.example.com/v1/memories/mem_9eff9c243db54ffda6c75295?userId=user_123"
```

**200**:

```json
{"memoryId": "mem_9eff9c243db54ffda6c75295", "result": "expired", "permanent": false}
```

SDK: [`forget`](sdk.md#forget).

### DELETE /v1/memories

Erase everything for one user: memories, relationships, audit trail and jobs.
**Irreversible.**

| Parameter | | |
|---|---|---|
| `userId` | string, **required** | |
| `confirm` | string, **required** | must be exactly `ERASE` |

```bash
curl -X DELETE "https://memory.example.com/v1/memories?userId=user_123&confirm=ERASE"
```

**200**:

```json
{"deletedMemories": 5, "deletedRelations": 0, "deletedOperations": 9, "deletedJobs": 1}
```

SDK: [`purge`](sdk.md#purge).

### GET /v1/memories/{memoryId}/history

Follow a memory's supersede chain back to the original fact, newest first.

```bash
curl "https://memory.example.com/v1/memories/mem_7c41d2a09b8e4f3a9d6b1e20/history?userId=user_123"
```

**200** — `{"count": 2, "memories": [ … ]}`:

```json
[
  {"memoryId": "mem_7c41d2a0…", "status": "active",     "content": "User lives in Bangalore."},
  {"memoryId": "mem_002e9cd0…", "status": "superseded", "content": "User lives in Chennai."}
]
```

SDK: [`history`](sdk.md#history).

### GET /v1/memories/{memoryId}/audit

Every decision that touched one memory, newest first.

```bash
curl "https://memory.example.com/v1/memories/mem_7c41d2a09b8e4f3a9d6b1e20/audit?userId=user_123"
```

**200** — a list of [audit operations](#audit-operation). SDK:
[`audit`](sdk.md#audit) with `memory_id`.

### GET /v1/memories/audit/operations

The user-wide decision log — `NOOP`s included, which is how you find out why
something was *not* remembered.

| Parameter | | |
|---|---|---|
| `userId` | string, **required** | |
| `action` | string | repeatable: `ADD`, `SUPERSEDE`, `MERGE`, `NOOP`, `MANUAL_ADD`, … |
| `limit` | integer | default `50` |
| `offset` | integer | default `0` |

```bash
curl "https://memory.example.com/v1/memories/audit/operations?userId=user_123&action=NOOP&limit=5"
```

**200** — a list of [audit operations](#audit-operation). SDK:
[`audit`](sdk.md#audit).

---

## Dream

### POST /v1/dream/synthesize

Look for patterns across a user's memories — connections none of them state
individually.

| Field | | |
|---|---|---|
| `wait` | boolean | run it before responding, instead of queueing. Default `false` |
| `force` | boolean | re-evaluate groups that already produced a pattern |
| `minMemories` | integer | active memories needed before looking, for this run only (≥ 2). Default `20` |

```bash
curl -X POST https://memory.example.com/v1/dream/synthesize \
  -H "Content-Type: application/json" \
  -d '{"userId": "user_123", "wait": true}'
```

**200** — a [dream job](#dream-job). If a run is already queued or running for
this user, **that** job is returned rather than a second one being started.
Synthesis also runs automatically as users accumulate memories, so you rarely
need this. SDK: [`synthesize`](sdk.md#synthesize).

### GET /v1/dream/jobs

Recent synthesis jobs for a user, newest first. `limit` (default `20`) and
`offset`.

```bash
curl "https://memory.example.com/v1/dream/jobs?userId=user_123&limit=20"
```

**200** — a list of [dream jobs](#dream-job). SDK: [`list_jobs`](sdk.md#list_jobs).

### GET /v1/dream/jobs/{jobId}

One job's status and counters. Poll this to follow a run started without `wait`.

```bash
curl "https://memory.example.com/v1/dream/jobs/job_8d2f1c4b?userId=user_123"
```

**200** — a [dream job](#dream-job). **404** if it does not exist in this scope.
SDK: [`get_job`](sdk.md#get_job) and [`wait_for`](sdk.md#wait_for).

### GET /v1/dream/stats

Durable per-user counters: memory counts by status, decision tallies, token
spend and estimated cost.

```bash
curl "https://memory.example.com/v1/dream/stats?userId=user_123"
```

**200**:

```json
{
  "counts":  {"active": 4, "superseded": 1, "merged": 0, "expired": 1},
  "actions": {"ADD": 4, "SUPERSEDE": 1, "NOOP": 2, "MANUAL_ADD": 1},
  "tokens":  {"totals": {"promptTokens": 8412, "completionTokens": 903,
                         "estimatedCost": 0.000213}}
}
```

Reading it: all `NOOP` usually means extraction is too strict for your messages;
all `ADD` means supersede and merge are not firing. Cost uses the prices under
`pricing` in `config/dream.yaml` — set them to match your provider contract.

SDK: [`stats`](sdk.md#stats).

### POST /v1/dream/consolidate

Run the consolidation pass now, for one user. **A dry run unless you say
otherwise.**

| Field | | |
|---|---|---|
| `dryRun` | boolean | report what would happen and change nothing. **Default `true`** |
| `compact` | boolean | also fold crowds of near-identical, low-value memories into summaries. One model call per group |
| `compactMinMemories` | integer | eligible memories a user needs before compaction runs (≥ 2). Default `40` |
| `decay` | boolean | apply the recall-decay rule in this run |
| `decayAfterDays` | integer | not recalled for this many days makes a memory a candidate. Default `90` |
| `decayImportanceFloor` | number | memories at or above this importance are never decayed. Default `0.5` |
| `recallEpoch` | string | the date recall tracking began. **Decay cannot fire without it** |

Every override applies to this call only; none changes what the nightly pass
does.

```bash
# 1. See what a 30-day window would retire.
curl -X POST https://memory.example.com/v1/dream/consolidate \
  -H "Content-Type: application/json" \
  -d '{"userId": "user_123", "decay": true, "decayAfterDays": 30,
       "recallEpoch": "2026-01-01"}'
```

**200** — a [consolidation report](#consolidation-report):

```json
{
  "dryRun": true, "scanned": 218, "lapsed": 2, "decayed": 54,
  "expired": 0, "protected": 4, "expiredIds": []
}
```

Send it again with `"dryRun": false` once the numbers look right. Retired
memories move to `expired`; folded ones to `merged` with a pointer to their
summary. Nothing is deleted. SDK: [`consolidate`](sdk.md#consolidate).

---

## Operations

These endpoints take no scope and no API key.

### GET /health

Liveness. Returns **200** `{"status": "ok"}` as long as the process is running.
Use it as your orchestrator's liveness probe.

### GET /ready

Readiness, with a check per dependency. Use it as the readiness probe, and as
the first thing you curl after a deploy.

```json
{
  "ready": true,
  "checks": {
    "database":     {"ok": true, "latencyMs": 3},
    "vectorStore":  {"ok": true, "latencyMs": 1},
    "embeddings":   {"ok": true, "latencyMs": 84},
    "llm":          {"ok": true, "latencyMs": 210},
    "queue":        {"ok": true}
  }
}
```

**503** if any dependency reports `"ok": false`.

### GET /v1/metrics

Request counters and latency histograms for **this process** — not durable, and
not aggregated across replicas. For durable per-user figures use
[`GET /v1/dream/stats`](#get-v1dreamstats); for a fleet view, export OTLP
(`DREAM_OTEL_ENABLED=true`).

### GET /v1/metrics/tokens

Token spend by operation for this process: extraction, decision, synthesis and
compaction, with prompt/completion counts and estimated cost.

---

## Objects

### Memory

| Field | | |
|---|---|---|
| `memoryId` | string | `mem_…`, or `pat_…` for a synthesized pattern |
| `content` | string | the fact, in the third person |
| `memoryType` | string | `preference`, `constraint`, `fact`, `pattern`, … |
| `status` | string | `active`, `superseded`, `merged` or `expired` |
| `importance` `confidence` | number | 0–1 |
| `explicit` | boolean | stated by the user, rather than inferred |
| `temporalNature` | string | `permanent`, `current`, `temporary`, `historical`, `future` |
| `createdAt` `updatedAt` | string | |
| `validFrom` `validUntil` | string \| null | when the fact is true |
| `supersededBy` `mergedInto` | string \| null | the replacing memory's id |
| `sourceMemoryIds` | string[] | evidence, on patterns and summaries |
| `score` `scoreBreakdown` | number, object | on search results only |
| `metadata` | object | whatever you sent |

### Memory detail

`GET /v1/memories/{memoryId}` and the two write endpoints return the memory plus
its graph:

| Field | | |
|---|---|---|
| `memory` | object | the [memory](#memory) |
| `relationships` | array | `{memoryId, relationType, content, status, memoryType}`. Relation types: `supersedes`, `supersededBy`, `mergedInto`, `mergedFrom`, `derivedFrom`, `supports` |
| `sourceMemories` | array | what a pattern or summary was built from |
| `derivedMemories` | array | patterns built on this memory |

### Add result

| Field | | |
|---|---|---|
| `action` | string | the most significant decision across the extracted facts |
| `memoryId` | string \| null | the memory that decision produced |
| `supersededMemoryIds` `mergedMemoryIds` | string[] | what it replaced or absorbed |
| `extractedCount` | integer | facts found in the message |
| `results` | array | one decision per extracted fact: `action`, `memoryId`, `content`, `reason`, `supersededMemoryIds`, `mergedMemoryIds`, `operationId` |

### Audit operation

One row per decision — including the ones that changed nothing.

| Field | | |
|---|---|---|
| `operationId` | string | |
| `action` | string | `ADD`, `SUPERSEDE`, `MERGE`, `NOOP`, `MANUAL_ADD`, `UPDATE`, `FORGET`, … |
| `inputContent` | string | what was being decided about |
| `reason` | string | why — `"greeting or acknowledgement"`, `"contradicts an existing location memory"` |
| `memoryId` | string \| null | what it produced or touched |
| `affectedMemoryIds` | string[] | |
| `messageId` | string \| null | your id, if you sent one |
| `createdAt` | string | |

### Dream job

| Field | | |
|---|---|---|
| `jobId` | string | |
| `status` | string | `queued`, `running`, `completed`, `failed`, `skipped` |
| `patternsCreated` `patternsUpdated` `patternsSkipped` | integer | |
| `memoriesAnalyzed` `clustersEvaluated` | integer | |
| `createdPatternIds` | string[] | |
| `durationMs` | integer | |
| `error` | string \| null | |

### Consolidation report

| Field | | |
|---|---|---|
| `dryRun` | boolean | whether anything was actually changed |
| `scanned` | integer | active memories examined |
| `lapsed` | integer | validity window closed |
| `decayed` | integer | decay candidates — reported even when decay was not applied |
| `expired` | integer | actually retired. Always `0` in a dry run |
| `protected` | integer | kept because an active pattern rests on them |
| `expiredIds` | string[] | first 20 retired ids |
| `clusters` `compacted` `absorbed` `rejected` | integer | compaction: groups found, summaries written, memories folded, summaries refused |
| `decayApplied` | boolean | whether decay was in force for this run |
| `durationMs` | integer | |

---

## Errors

Every error is JSON with the same shape:

```json
{
  "error": {
    "code": "conflict",
    "message": "Memory mem_002e9cd0… is superseded and cannot be edited.",
    "details": {"memoryId": "mem_002e9cd0a9d94445bb4edad2", "status": "superseded"},
    "requestId": "req_4f1c9e2a7b3d4e5f"
  }
}
```

| Status | `code` | |
|---|---|---|
| **401** | `unauthorized` | the API key is missing, invalid, or bound to a different client |
| **404** | `not_found` | the memory or job does not exist **in this scope** |
| **409** | `conflict` | editing history — a `superseded` or `merged` memory |
| **422** | `validation_error` | an argument failed validation: empty prompt, `importance` above 1, no user in scope |
| **429** | `rate_limited` | the synthesis queue is full (`DREAM_DREAM__SYNTHESIS__MAX_QUEUED`) |
| **502** | `provider_error` | the LLM or embedding provider failed or timed out |
| **500** | `internal_error` | anything else — quote `requestId` when reporting it |

A **404** means *not in this scope*, not *does not exist anywhere*. If you get one
you did not expect, check the scope you sent before checking the id: a `clientId`
bound to your API key overrides the one in your request.

In the Python SDK these map to `DreamAuthError`, `DreamNotFoundError`,
`DreamValidationError` and `DreamAPIError` — see [Errors](sdk.md#errors).
