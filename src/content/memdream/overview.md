# Overview

MemDream is a long-term memory layer for AI agents. It stores the durable facts
a user tells you, and — this is the part a vector database does not do — it
reasons about each new fact against what is already stored before writing
anything.

Tell a plain vector store *"I live in Chennai"* and later *"I moved to
Bangalore"* and it now holds both, answering with whichever happens to be worded
closer to the question. MemDream recognises the second statement contradicts the
first, retires the old memory, and links it forward to its replacement.

```python
from memdream import MemDream

mem = MemDream(user_id="user_123")

mem.add("Hi, I'm Priya. I live in Chennai.")
result = mem.add("I live in Bangalore now.")

result.action                  # 'SUPERSEDE'
result.superseded_memory_ids   # ['mem_002e9cd0a9d94445bb4edad2']

mem.search("where does the user live?", latest_only=True).as_context()
# '- User lives in Bangalore.'
```

---

## Install

Python 3.10 or newer.

```bash
pip install "memdream @ git+https://github.com/Mamlesh18/MemDream.git"
```

Optional providers ship as extras — `gemini`, `anthropic`, `postgres`,
`qdrant`, `pgvector`, `chroma`, `pinecone`, `milvus`, `azure-search`, `otel`:

```bash
pip install "memdream[gemini,postgres] @ git+https://github.com/Mamlesh18/MemDream.git"
```

OpenAI, Azure OpenAI, Groq, Ollama, Together and Fireworks need no extra.

---

## Two ways to run it

There is one surface with two implementations. **The method names, arguments,
return types and exceptions are identical**, so moving between them is a one-line
change.

| | Embedded — `MemDream` | Hosted — `DreamClient` |
|---|---|---|
| **Runs** | the memory engine inside your process | calls a MemDream server over HTTP |
| **Deploy** | nothing | one API process and one database |
| **Needs** | a database it can reach, plus LLM credentials | the server's URL and an API key |
| **Best for** | scripts, notebooks, one service, getting started | several services or languages sharing one memory |

```python
mem = MemDream(user_id="alice")                                          # embedded
mem = DreamClient("https://memory.example.com", api_key="sk_...", user_id="alice")  # hosted
```

Both have async equivalents, `AsyncMemDream` and `AsyncDreamClient`, on which
every method is a coroutine.

Start embedded. Move to hosted when a second service needs the same memory.

---

## Configure it

*Embedded only — a hosted client is configured by its constructor alone.*

The embedded SDK builds the same engine the server runs, so it reads the same
`DREAM_*` environment variables (or a `.env` file in the working directory). The
minimum is a database, an LLM provider and an embedding provider:

```bash
# .env
DREAM_MONGODB_URI=mongodb://localhost:27017
DREAM_MONGODB_DATABASE=memdream
DREAM_IDENTITY_SALT=a-long-random-string-you-never-change

DREAM_LLM_PROVIDER=openai
DREAM_EMBEDDING_PROVIDER=openai
OPENAI_API_KEY=sk-...
```

Any setting can also be passed straight to the constructor:

```python
mem = MemDream(
    user_id="user_123",
    llm_provider="gemini",
    embedding_provider="gemini",
    domain="A restaurant ordering assistant. Remember contact and delivery "
           "details, dietary needs, dislikes, and usual orders per meal.",
)
```

`domain` is worth setting: one sentence describing your deployment is injected
into extraction and decisions, and it is the cheapest quality win available.

Every variable is listed in [Self-hosting](self-hosting.md#configuration).

---

## Core concepts


Five ideas explain almost everything the SDK and the API do.

### Scope: whose memory is it

Every call runs inside a scope. Set it once on the constructor and every call
inherits it; override any part per call.

| Keyword | |
|---|---|
| `user_id` | the user. This or `phone_number` is required |
| `phone_number` | derive the user id from a phone number instead |
| `agent_id` | which agent or bot |
| `client_id` | the tenant |
| `namespace` | further dimensions, e.g. `{"env": "prod"}` |
| `bot_id` | previous name for `agent_id`, still accepted |

Scope is not a filter applied at the end — every repository method takes one, and
the vector index is physically partitioned by it. Cross-tenant retrieval is not
something a filtering bug can cause; it is unrepresentable.

A misspelt keyword raises `TypeError` immediately, rather than quietly searching
a different partition and returning an empty result that looks real. A call with
no user raises `ValueError` before anything is sent.

### The memory lifecycle

Each fact extracted from a message resolves to exactly one outcome. The model
proposes; the backend decides and applies.

| | |
|---|---|
| **ADD** | A genuinely new fact. Nothing else changes. |
| **SUPERSEDE** | Contradicts something stored. The old memory is kept, marked `superseded`, and points at its replacement. |
| **MERGE** | The same fact, said better. The old memory is kept, marked `merged`, and points at the canonical version. |
| **NOOP** | Adds nothing new. Nothing changes — and the reason is written to the audit log anyway. |

**Nothing is ever deleted.** Superseded and merged memories are retained with
pointers to whatever replaced them, so *"where did they live before, and when did
that change?"* stays answerable.

A memory is therefore always in exactly one status:

- `active` — currently true, and returned by search
- `superseded` — replaced by a newer, contradicting fact
- `merged` — folded into a more precise version
- `expired` — retired by `forget()` or consolidation. Auditable, not searchable

### The memory object

A memory is a sentence plus the metadata that makes it rankable and retirable.

| Field | |
|---|---|
| `memory_id` | `mem_…`, or `pat_…` for a synthesized pattern |
| `content` | the fact, written in the third person: `"User is allergic to peanuts."` |
| `memory_type` | free-form. Extraction uses `fact`, `preference`, `constraint`, `event`, `relationship`, `pattern` and `other` |
| `status` | `active`, `superseded`, `merged` or `expired` |
| `importance` | 0–1. How much it should weigh in ranking |
| `confidence` | 0–1. How sure extraction was |
| `explicit` | the user said it, rather than it being inferred |
| `temporal_nature` | `permanent`, `current`, `temporary`, `historical` or `future` |
| `valid_from` `valid_until` | when the fact is true. Consolidation retires it after `valid_until` |
| `superseded_by` `merged_into` | the replacing memory |
| `source_memory_ids` | the evidence a pattern or summary was built from |
| `metadata` | whatever you attached |

`permanent` memories are protected: the decision step is not allowed to retire
them, whatever the model proposes.

### How recall ranks memories

`search()` is not pure vector similarity. Candidates are retrieved from the
scope's partition of the vector index, then scored on four things:

- **semantic similarity** to the query
- **importance**, so a hard constraint outranks a passing remark
- **recency**, so current facts beat stale ones
- **status**, so `active` memories outrank `superseded` ones

Each result carries its `score` and a `score_breakdown`, so a surprising ordering
can be explained rather than guessed at. `latest_only=True` restricts the answer
to `active` memories — *"what is true now?"* — and `as_of` restricts it to what
was true at a given instant.

### Synthesis — finding patterns

In the background, off the request path, Dream narrows a user's memories to a
few hundred candidates, clusters them, and asks one model call per cluster
whether there is a pattern none of the memories state individually. Anything it
finds is written as its own memory, with edges back to the evidence.

Before writing, it checks source overlap and then semantic similarity against
existing patterns, so repeated runs do not accumulate near-duplicates. Synthesis
triggers automatically as users accumulate memories; you rarely call it yourself.

### Consolidation — forgetting safely

A nightly pass retires memories whose validity window has closed, and — if you
enable decay — memories that have not been recalled in a long time.

It is **a dry run by default**: it reports what it would retire and changes
nothing until you ask it to. It never retires a memory an active pattern rests
on, and it expires rather than deletes. Decay cannot fire at all without a
`recall_epoch`, so a fresh deployment cannot accidentally forget a backfill.

### Describing your domain

`DREAM_DOMAIN` (or `domain=` on the constructor) is one sentence describing what
your deployment is for. It is injected into extraction and into the decision
step, and it is the cheapest quality improvement available:

```python
domain="A restaurant ordering assistant. Remember contact and delivery details, "
       "dietary needs, dislikes, and usual orders per meal."
```

Without it, extraction has to guess what matters in your product. With it, the
same message yields fewer, better memories.

---

## Use it in an agent

Recall before the model answers; remember after.

```python
from memdream import MemDream

mem = MemDream()          # one instance per process — it holds connection pools

def handle(user_id: str, message: str) -> str:
    memories = mem.search(message, latest_only=True, limit=8, user_id=user_id)

    reply = llm(
        system="You are a helpful assistant.\n\n"
               f"What you know about this user:\n{memories.as_context()}",
        user=message,
    )

    mem.add(message, user_id=user_id)      # after — the message is not context for itself
    return reply
```

Three things worth copying:

- **Recall before, remember after.** Otherwise the current message becomes
  context for answering itself.
- **Create the instance once.** It owns database and HTTP connection pools;
  one per request pays setup every time and exhausts connection limits under
  load.
- **Move `add` off the reply path** where you can — a task queue, a background
  thread, or `asyncio.create_task` with `AsyncMemDream`. Remembering takes one to
  two model calls and the user should not wait for them.

---

## Try it with no infrastructure

The offline providers need no database, no key and no network — useful for
seeing the decision flow and for tests. Add `pip install mongomock-motor`, then:

```python
from mongomock_motor import AsyncMongoMockClient
from app.repositories.mongo import MongoDatabase
from memdream import MemDream

offline = MemDream(
    user_id="alice",
    database=MongoDatabase(AsyncMongoMockClient(tz_aware=True), "demo"),
    llm_provider="fake",
    embedding_provider="fake",
    vector_provider="memory",
    identity_salt="demo",
)
```

The fake providers are deterministic heuristics, not stubs — good for exercising
the flow, not for judging extraction quality.

---

## Where to go next
