import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, ChevronDown, ChevronRight, Star, Check, Shuffle, Search,
  Youtube, Code2, X, Lock, Copy, AlertTriangle, ExternalLink, BookOpen,
} from "lucide-react";
import { api } from "@/services/api";

// ─── Dark palette (this page only) ───────────────────────────────────────────
const BG     = "#0B0D10";
const SURF    = "#15171C";
const SURF2   = "#1B1E24";
const BORD    = "#262A31";
const TXT      = "#E6E8EB";
const MUTE     = "#8B919A";
const Y        = "#FFE500";

const EASY = "#22C55E";
const MED  = "#F59E0B";
const HARD = "#EF4444";

const SANS: React.CSSProperties = { fontFamily: "'Geist', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" };
const MONO: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };

const DAILY_SOLUTION_LIMIT = 3;

type Difficulty = "Easy" | "Medium" | "Hard";

interface SheetProblem {
  id: string;
  title: string;
  difficulty: Difficulty;
  youtubeUrl?: string;   // Resource (video lecture)
  solveUrl?: string;     // Solve (practice platform)
  solution?: string;     // Python solution (revealed via the gated modal)
}
interface SheetSubSection { id: string; title: string; problems: SheetProblem[]; }
interface SheetSection { id: string; title: string; subSections: SheetSubSection[]; }

// ─── Python solutions ────────────────────────────────────────────────────────
const SOL_INTRO = `
# Singly Linked List — node, build, and traverse
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def build_linked_list(arr):
    head = None
    for val in reversed(arr):
        head = ListNode(val, head)
    return head

def print_list(head):
    out = []
    cur = head
    while cur:
        out.append(str(cur.val))
        cur = cur.next
    print(" -> ".join(out))

# Example
head = build_linked_list([1, 2, 3, 4])
print_list(head)        # 1 -> 2 -> 3 -> 4
`.trim();

const SOL_INSERT_HEAD = `
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def insert_at_head(head, val):
    # New node points to the old head and becomes the new head
    return ListNode(val, head)

# Example
head = ListNode(2, ListNode(3))
head = insert_at_head(head, 1)   # 1 -> 2 -> 3
`.trim();

const SOL_DELETE_HEAD = `
def delete_head(head):
    # Nothing to delete on an empty list
    if not head:
        return None
    # The second node becomes the new head
    return head.next
`.trim();

const SOL_LENGTH = `
def length(head):
    count = 0
    cur = head
    while cur:
        count += 1
        cur = cur.next
    return count
`.trim();

const SOL_SEARCH = `
def search(head, target):
    cur = head
    while cur:
        if cur.val == target:
            return True
        cur = cur.next
    return False
`.trim();

const SOL_MIDDLE = `
# Tortoise & Hare — fast moves 2x, slow lands on the middle
class Solution:
    def middleNode(self, head):
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        return slow
`.trim();

const SOL_REVERSE_ITER = `
# Iterative reversal — flip each next pointer as you walk
class Solution:
    def reverseList(self, head):
        prev = None
        cur = head
        while cur:
            nxt = cur.next
            cur.next = prev
            prev = cur
            cur = nxt
        return prev
`.trim();

const SOL_REVERSE_REC = `
# Recursive reversal
class Solution:
    def reverseList(self, head):
        if not head or not head.next:
            return head
        new_head = self.reverseList(head.next)
        head.next.next = head
        head.next = None
        return new_head
`.trim();

const SOL_DETECT_LOOP = `
# Floyd's cycle detection — slow and fast meet inside a loop
class Solution:
    def hasCycle(self, head):
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow is fast:
                return True
        return False
`.trim();

const SOL_ODD_EVEN = `
# Group odd-indexed nodes first, then even-indexed
class Solution:
    def oddEvenList(self, head):
        if not head or not head.next:
            return head
        odd = head
        even = head.next
        even_head = even
        while even and even.next:
            odd.next = even.next
            odd = odd.next
            even.next = odd.next
            even = even.next
        odd.next = even_head
        return head
`.trim();

const SOL_SORT = `
# Merge sort on a linked list — O(n log n), O(1) extra
class Solution:
    def sortList(self, head):
        if not head or not head.next:
            return head
        # split into two halves
        slow, fast = head, head.next
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        mid = slow.next
        slow.next = None
        left = self.sortList(head)
        right = self.sortList(mid)
        return self.merge(left, right)

    def merge(self, a, b):
        dummy = tail = ListNode()
        while a and b:
            if a.val <= b.val:
                tail.next, a = a, a.next
            else:
                tail.next, b = b, b.next
            tail = tail.next
        tail.next = a or b
        return dummy.next
`.trim();

const SOL_ROTATE = `
# Rotate right by k — close into a ring, then cut
class Solution:
    def rotateRight(self, head, k):
        if not head or not head.next or k == 0:
            return head
        # length and tail
        n, tail = 1, head
        while tail.next:
            tail = tail.next
            n += 1
        tail.next = head            # make it circular
        k = k % n
        steps = n - k
        new_tail = head
        for _ in range(steps - 1):
            new_tail = new_tail.next
        new_head = new_tail.next
        new_tail.next = None        # break the ring
        return new_head
`.trim();

const SOL_ADD_TWO = `
# Digits are stored in reverse order — add with carry
class Solution:
    def addTwoNumbers(self, l1, l2):
        dummy = tail = ListNode()
        carry = 0
        while l1 or l2 or carry:
            total = carry
            if l1:
                total += l1.val
                l1 = l1.next
            if l2:
                total += l2.val
                l2 = l2.next
            carry, digit = divmod(total, 10)
            tail.next = ListNode(digit)
            tail = tail.next
        return dummy.next
`.trim();

const SOL_DELETE_MIDDLE = `
# Delete middle — slow stops just before the middle
class Solution:
    def deleteMiddle(self, head):
        if not head or not head.next:
            return None
        slow = head
        fast = head.next.next
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        slow.next = slow.next.next
        return head
`.trim();

// ─── Recursion solutions ──────────────────────────────────────────────────────
const SOL_REC_ATOI = `
# Recursively consume digits, then clamp to 32-bit range
class Solution:
    def myAtoi(self, s: str) -> int:
        s = s.strip()
        if not s:
            return 0
        sign, i = 1, 0
        if s[0] in "+-":
            sign = -1 if s[0] == "-" else 1
            i = 1

        def consume(idx, acc):
            if idx == len(s) or not s[idx].isdigit():
                return acc
            return consume(idx + 1, acc * 10 + int(s[idx]))

        num = sign * consume(i, 0)
        INT_MIN, INT_MAX = -2**31, 2**31 - 1
        return max(INT_MIN, min(INT_MAX, num))
`.trim();

const SOL_REC_POW = `
# Fast exponentiation — O(log n)
class Solution:
    def myPow(self, x: float, n: int) -> float:
        if n < 0:
            x, n = 1 / x, -n
        def fast(base, exp):
            if exp == 0:
                return 1.0
            half = fast(base, exp // 2)
            return half * half * (base if exp % 2 else 1)
        return fast(x, n)
`.trim();

const SOL_REC_GOOD = `
# Even indices -> 5 choices (even digits), odd indices -> 4 (primes)
class Solution:
    def countGoodNumbers(self, n: int) -> int:
        MOD = 10**9 + 7
        def power(base, exp):
            if exp == 0:
                return 1
            half = power(base, exp // 2) % MOD
            half = (half * half) % MOD
            return half * base % MOD if exp % 2 else half
        evens = (n + 1) // 2
        odds = n // 2
        return power(5, evens) * power(4, odds) % MOD
`.trim();

const SOL_REC_REVSTACK = `
# Reverse a stack using only recursion (no extra stack)
def insert_at_bottom(stack, val):
    if not stack:
        stack.append(val)
        return
    top = stack.pop()
    insert_at_bottom(stack, val)
    stack.append(top)

def reverse_stack(stack):
    if not stack:
        return
    top = stack.pop()
    reverse_stack(stack)
    insert_at_bottom(stack, top)
`.trim();

const SOL_REC_BINSTR = `
# A '1' can only follow a '0' -> never two 1s in a row
def generate(n):
    res = []
    def build(cur, last):
        if len(cur) == n:
            res.append(cur)
            return
        build(cur + "0", 0)          # 0 can always follow
        if last == 0:
            build(cur + "1", 1)      # 1 only if previous was 0
    build("", 0)
    return res
`.trim();

const SOL_REC_PAREN = `
# Add '(' while we have some left; add ')' only if it stays valid
class Solution:
    def generateParenthesis(self, n: int):
        res = []
        def build(cur, open_, close):
            if len(cur) == 2 * n:
                res.append(cur)
                return
            if open_ < n:
                build(cur + "(", open_ + 1, close)
            if close < open_:
                build(cur + ")", open_, close + 1)
        build("", 0, 0)
        return res
`.trim();

const SOL_REC_SUBSEQK = `
# At each index: pick it or skip it
def count_subsequences(arr, k):
    def rec(i, target):
        if target == 0:
            return 1
        if i == len(arr) or target < 0:
            return 0
        pick = rec(i + 1, target - arr[i])
        skip = rec(i + 1, target)
        return pick + skip
    return rec(0, k)
`.trim();

const SOL_REC_COMBSUM = `
# Same number may be reused -> stay on index i when you pick
class Solution:
    def combinationSum(self, candidates, target):
        res = []
        def rec(i, remain, path):
            if remain == 0:
                res.append(path[:])
                return
            if i == len(candidates) or remain < 0:
                return
            path.append(candidates[i])
            rec(i, remain - candidates[i], path)   # pick (reuse)
            path.pop()
            rec(i + 1, remain, path)               # skip
        rec(0, target, [])
        return res
`.trim();

const SOL_REC_SUBSETS = `
# Subset sums (gfg) — include / exclude each element
class Solution:
    def subsetSums(self, arr, n):
        res = []
        def rec(i, total):
            if i == n:
                res.append(total)
                return
            rec(i + 1, total + arr[i])   # include arr[i]
            rec(i + 1, total)            # exclude arr[i]
        rec(0, 0)
        return sorted(res)
`.trim();

const SOL_REC_COMB3 = `
# k numbers from 1..9, each used once, summing to n
class Solution:
    def combinationSum3(self, k, n):
        res = []
        def rec(start, remain, path):
            if len(path) == k:
                if remain == 0:
                    res.append(path[:])
                return
            for d in range(start, 10):
                if d > remain:
                    break
                path.append(d)
                rec(d + 1, remain - d, path)
                path.pop()
        rec(1, n, [])
        return res
`.trim();

const SOL_REC_PALPART = `
# Cut at every spot where the left piece is a palindrome
class Solution:
    def partition(self, s):
        res = []
        def rec(start, path):
            if start == len(s):
                res.append(path[:])
                return
            for end in range(start + 1, len(s) + 1):
                piece = s[start:end]
                if piece == piece[::-1]:
                    path.append(piece)
                    rec(end, path)
                    path.pop()
        rec(0, [])
        return res
`.trim();

const SOL_REC_WORDSEARCH = `
# DFS from every cell, mark visited, backtrack
class Solution:
    def exist(self, board, word):
        rows, cols = len(board), len(board[0])
        def dfs(r, c, i):
            if i == len(word):
                return True
            if r < 0 or c < 0 or r >= rows or c >= cols or board[r][c] != word[i]:
                return False
            tmp = board[r][c]
            board[r][c] = "#"            # mark visited
            found = (dfs(r+1, c, i+1) or dfs(r-1, c, i+1) or
                     dfs(r, c+1, i+1) or dfs(r, c-1, i+1))
            board[r][c] = tmp            # backtrack
            return found
        for r in range(rows):
            for c in range(cols):
                if dfs(r, c, 0):
                    return True
        return False
`.trim();

const SOL_REC_RATMAZE = `
# Explore D, L, R, U in lexicographic order; block cells while visiting
class Solution:
    def findPath(self, m, n):
        res = []
        def dfs(r, c, path):
            if r < 0 or c < 0 or r >= n or c >= n or m[r][c] == 0:
                return
            if r == n - 1 and c == n - 1:
                res.append(path)
                return
            m[r][c] = 0                  # block
            dfs(r + 1, c, path + "D")
            dfs(r, c - 1, path + "L")
            dfs(r, c + 1, path + "R")
            dfs(r - 1, c, path + "U")
            m[r][c] = 1                  # backtrack
        if m[0][0] == 1:
            dfs(0, 0, "")
        return sorted(res)
`.trim();

const SOL_REC_SUDOKU = `
# Try 1-9 in each empty cell; backtrack if it leads nowhere
class Solution:
    def solveSudoku(self, board):
        def valid(r, c, ch):
            for i in range(9):
                if board[r][i] == ch or board[i][c] == ch:
                    return False
                if board[3*(r//3) + i//3][3*(c//3) + i%3] == ch:
                    return False
            return True

        def solve():
            for r in range(9):
                for c in range(9):
                    if board[r][c] == ".":
                        for ch in "123456789":
                            if valid(r, c, ch):
                                board[r][c] = ch
                                if solve():
                                    return True
                                board[r][c] = "."
                        return False
            return True
        solve()
`.trim();

// ─── Stack & Queue solutions ──────────────────────────────────────────────────
const SOL_STK_STACK_ARR = `
# Stack on a plain array — all O(1)
class Stack:
    def __init__(self):
        self.arr = []

    def push(self, x):
        self.arr.append(x)

    def pop(self):
        return self.arr.pop() if self.arr else -1

    def top(self):
        return self.arr[-1] if self.arr else -1

    def is_empty(self):
        return len(self.arr) == 0
`.trim();

const SOL_STK_QUEUE_ARR = `
# Queue on an array (front/rear pointers keep it O(1))
class Queue:
    def __init__(self):
        self.arr = []
        self.front = 0

    def enqueue(self, x):
        self.arr.append(x)

    def dequeue(self):
        if self.front == len(self.arr):
            return -1
        val = self.arr[self.front]
        self.front += 1
        return val
`.trim();

const SOL_STK_STACK_USING_Q = `
# Push is O(n): rotate the queue so the newest sits at the front
from collections import deque
class MyStack:
    def __init__(self):
        self.q = deque()

    def push(self, x):
        self.q.append(x)
        for _ in range(len(self.q) - 1):
            self.q.append(self.q.popleft())

    def pop(self):
        return self.q.popleft()

    def top(self):
        return self.q[0]

    def empty(self):
        return not self.q
`.trim();

const SOL_STK_QUEUE_USING_S = `
# Two stacks: amortized O(1). Pour 'in' into 'out' only when 'out' is empty.
class MyQueue:
    def __init__(self):
        self.ins = []
        self.outs = []

    def push(self, x):
        self.ins.append(x)

    def _move(self):
        if not self.outs:
            while self.ins:
                self.outs.append(self.ins.pop())

    def pop(self):
        self._move()
        return self.outs.pop()

    def peek(self):
        self._move()
        return self.outs[-1]

    def empty(self):
        return not self.ins and not self.outs
`.trim();

const SOL_STK_BALANCED = `
# Push openers, match each closer with the top of the stack
class Solution:
    def isValid(self, s: str) -> bool:
        pairs = {")": "(", "]": "[", "}": "{"}
        stack = []
        for ch in s:
            if ch in "([{":
                stack.append(ch)
            elif not stack or stack.pop() != pairs[ch]:
                return False
        return not stack
`.trim();

const SOL_STK_MIN = `
# Store (value, min-so-far) so getMin is O(1)
class MinStack:
    def __init__(self):
        self.stack = []

    def push(self, val):
        cur_min = val if not self.stack else min(val, self.stack[-1][1])
        self.stack.append((val, cur_min))

    def pop(self):
        self.stack.pop()

    def top(self):
        return self.stack[-1][0]

    def getMin(self):
        return self.stack[-1][1]
`.trim();

const SOL_STK_INFIX_POST = `
# Operators wait on a stack until a lower-precedence one arrives
def infix_to_postfix(s):
    prec = {"+": 1, "-": 1, "*": 2, "/": 2, "^": 3}
    right = {"^"}
    out, stack = [], []
    for ch in s:
        if ch.isalnum():
            out.append(ch)
        elif ch == "(":
            stack.append(ch)
        elif ch == ")":
            while stack and stack[-1] != "(":
                out.append(stack.pop())
            stack.pop()
        else:
            while (stack and stack[-1] != "(" and
                   (prec[stack[-1]] > prec[ch] or
                    (prec[stack[-1]] == prec[ch] and ch not in right))):
                out.append(stack.pop())
            stack.append(ch)
    while stack:
        out.append(stack.pop())
    return "".join(out)
`.trim();

const SOL_STK_PRE_INFIX = `
# Scan prefix right-to-left; wrap each operator around its two operands
def prefix_to_infix(s):
    ops = set("+-*/^")
    stack = []
    for ch in reversed(s):
        if ch in ops:
            a, b = stack.pop(), stack.pop()
            stack.append("(" + a + ch + b + ")")
        else:
            stack.append(ch)
    return stack[-1]
`.trim();

const SOL_STK_PRE_POST = `
# Scan prefix right-to-left; emit operands then operator
def prefix_to_postfix(s):
    ops = set("+-*/^")
    stack = []
    for ch in reversed(s):
        if ch in ops:
            a, b = stack.pop(), stack.pop()
            stack.append(a + b + ch)
        else:
            stack.append(ch)
    return stack[-1]
`.trim();

const SOL_STK_INFIX_PRE = `
# Reverse + swap brackets, run infix->postfix, then reverse the result
def infix_to_prefix(s):
    prec = {"+": 1, "-": 1, "*": 2, "/": 2, "^": 3}
    def to_postfix(tokens):
        out, stack = [], []
        for ch in tokens:
            if ch.isalnum():
                out.append(ch)
            elif ch == "(":
                stack.append(ch)
            elif ch == ")":
                while stack and stack[-1] != "(":
                    out.append(stack.pop())
                stack.pop()
            else:
                while stack and stack[-1] != "(" and prec.get(stack[-1], 0) >= prec[ch]:
                    out.append(stack.pop())
                stack.append(ch)
        while stack:
            out.append(stack.pop())
        return out
    rev = []
    for ch in reversed(s):
        rev.append(")" if ch == "(" else "(" if ch == ")" else ch)
    return "".join(reversed(to_postfix(rev)))
`.trim();

const SOL_STK_NGE = `
# Monotonic decreasing stack — pop smaller, they found their next greater
class Solution:
    def nextGreaterElement(self, nums1, nums2):
        nge, stack = {}, []
        for x in nums2:
            while stack and stack[-1] < x:
                nge[stack.pop()] = x
            stack.append(x)
        return [nge.get(x, -1) for x in nums1]
`.trim();

const SOL_STK_TRAP = `
# Two pointers — water above a bar = min(maxLeft, maxRight) - height
class Solution:
    def trap(self, height):
        l, r = 0, len(height) - 1
        left_max = right_max = water = 0
        while l < r:
            if height[l] <= height[r]:
                left_max = max(left_max, height[l])
                water += left_max - height[l]
                l += 1
            else:
                right_max = max(right_max, height[r])
                water += right_max - height[r]
                r -= 1
        return water
`.trim();

const SOL_STK_SUBARR_MIN = `
# Each element contributes (count of subarrays where it's the min) * value
class Solution:
    def sumSubarrayMins(self, arr):
        MOD = 10**9 + 7
        n = len(arr)
        prev, nxt = [-1] * n, [n] * n
        stack = []
        for i in range(n):                 # previous strictly-smaller
            while stack and arr[stack[-1]] >= arr[i]:
                stack.pop()
            prev[i] = stack[-1] if stack else -1
            stack.append(i)
        stack = []
        for i in range(n - 1, -1, -1):     # next smaller-or-equal
            while stack and arr[stack[-1]] > arr[i]:
                stack.pop()
            nxt[i] = stack[-1] if stack else n
            stack.append(i)
        total = 0
        for i in range(n):
            total = (total + arr[i] * (i - prev[i]) * (nxt[i] - i)) % MOD
        return total
`.trim();

const SOL_STK_SUBARR_RANGE = `
# range = max - min. Sum over all subarrays = sum(maxes) - sum(mins).
# Clear O(n^2); an O(n) monotonic-stack version exists.
class Solution:
    def subArrayRanges(self, nums):
        total, n = 0, len(nums)
        for i in range(n):
            mn = mx = nums[i]
            for j in range(i, n):
                mn = min(mn, nums[j])
                mx = max(mx, nums[j])
                total += mx - mn
        return total
`.trim();

const SOL_STK_REMOVE_K = `
# Greedily pop a bigger digit when a smaller one comes (monotonic increasing)
class Solution:
    def removeKdigits(self, num, k):
        stack = []
        for d in num:
            while k > 0 and stack and stack[-1] > d:
                stack.pop()
                k -= 1
            stack.append(d)
        if k:
            stack = stack[:len(stack) - k]   # still need to drop from the end
        return "".join(stack).lstrip("0") or "0"
`.trim();

const SOL_STK_SLIDING_MAX = `
# Deque of indices, values decreasing — front is always the window max
from collections import deque
class Solution:
    def maxSlidingWindow(self, nums, k):
        dq, res = deque(), []
        for i, x in enumerate(nums):
            if dq and dq[0] <= i - k:        # drop out-of-window index
                dq.popleft()
            while dq and nums[dq[-1]] < x:   # drop smaller values
                dq.pop()
            dq.append(i)
            if i >= k - 1:
                res.append(nums[dq[0]])
        return res
`.trim();

const SOL_STK_STOCK_SPAN = `
# Stack of (price, span) — fold spans of all smaller-or-equal prices
class StockSpanner:
    def __init__(self):
        self.stack = []

    def next(self, price):
        span = 1
        while self.stack and self.stack[-1][0] <= price:
            span += self.stack.pop()[1]
        self.stack.append((price, span))
        return span
`.trim();

const SOL_STK_CELEBRITY = `
# Two-pointer elimination: a celeb knows nobody and is known by all
class Solution:
    def celebrity(self, M, n):
        top, bottom = 0, n - 1
        while top < bottom:
            if M[top][bottom] == 1:      # top knows someone -> not celeb
                top += 1
            elif M[bottom][top] == 1:    # bottom knows someone -> not celeb
                bottom -= 1
            else:
                top += 1
                bottom -= 1
        cand = top
        for i in range(n):               # verify the candidate
            if i != cand and (M[cand][i] == 1 or M[i][cand] == 0):
                return -1
        return cand
`.trim();

// ─── Sliding Window & Two Pointer solutions ───────────────────────────────────
const SOL_SW_LONGEST_UNIQUE = `
# Shrink the window when a repeat appears
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        seen, left, best = {}, 0, 0
        for right, ch in enumerate(s):
            if ch in seen and seen[ch] >= left:
                left = seen[ch] + 1
            seen[ch] = right
            best = max(best, right - left + 1)
        return best
`.trim();

const SOL_SW_MAX_ONES = `
# Longest window with at most k zeros (we may flip k zeros)
class Solution:
    def longestOnes(self, nums, k):
        left = zeros = best = 0
        for right in range(len(nums)):
            if nums[right] == 0:
                zeros += 1
            while zeros > k:
                if nums[left] == 0:
                    zeros -= 1
                left += 1
            best = max(best, right - left + 1)
        return best
`.trim();

const SOL_SW_FRUIT = `
# Longest subarray with at most 2 distinct values
class Solution:
    def totalFruit(self, fruits):
        count, left, best = {}, 0, 0
        for right, f in enumerate(fruits):
            count[f] = count.get(f, 0) + 1
            while len(count) > 2:
                count[fruits[left]] -= 1
                if count[fruits[left]] == 0:
                    del count[fruits[left]]
                left += 1
            best = max(best, right - left + 1)
        return best
`.trim();

const SOL_SW_CHAR_REPLACE = `
# window size - count(most frequent char) = chars we must replace
class Solution:
    def characterReplacement(self, s, k):
        count, left, max_freq, best = {}, 0, 0, 0
        for right, ch in enumerate(s):
            count[ch] = count.get(ch, 0) + 1
            max_freq = max(max_freq, count[ch])
            while (right - left + 1) - max_freq > k:
                count[s[left]] -= 1
                left += 1
            best = max(best, right - left + 1)
        return best
`.trim();

const SOL_SW_BINARY_SUM = `
# exactly(goal) = atMost(goal) - atMost(goal - 1)
class Solution:
    def numSubarraysWithSum(self, nums, goal):
        def at_most(k):
            if k < 0:
                return 0
            left = total = res = 0
            for right in range(len(nums)):
                total += nums[right]
                while total > k:
                    total -= nums[left]
                    left += 1
                res += right - left + 1
            return res
        return at_most(goal) - at_most(goal - 1)
`.trim();

const SOL_SW_NICE = `
# Count subarrays with exactly k odd numbers (atMost trick)
class Solution:
    def numberOfSubarrays(self, nums, k):
        def at_most(k):
            if k < 0:
                return 0
            left = odd = res = 0
            for right in range(len(nums)):
                odd += nums[right] % 2
                while odd > k:
                    odd -= nums[left] % 2
                    left += 1
                res += right - left + 1
            return res
        return at_most(k) - at_most(k - 1)
`.trim();

const SOL_SW_THREE_CHARS = `
# For each right, add (1 + earliest of the last a/b/c positions)
class Solution:
    def numberOfSubstrings(self, s: str) -> int:
        last = {"a": -1, "b": -1, "c": -1}
        res = 0
        for i, ch in enumerate(s):
            last[ch] = i
            res += 1 + min(last["a"], last["b"], last["c"])
        return res
`.trim();

const SOL_SW_MAX_CARDS = `
# Take k cards from the two ends -> slide the split point
class Solution:
    def maxScore(self, cardPoints, k):
        total = sum(cardPoints[:k])
        best = total
        for i in range(1, k + 1):
            total += cardPoints[-i] - cardPoints[k - i]
            best = max(best, total)
        return best
`.trim();

const SOL_SW_K_DISTINCT = `
# Longest window with at most k distinct characters
class Solution:
    def lengthOfLongestSubstringKDistinct(self, s, k):
        if k == 0:
            return 0
        count, left, best = {}, 0, 0
        for right, ch in enumerate(s):
            count[ch] = count.get(ch, 0) + 1
            while len(count) > k:
                count[s[left]] -= 1
                if count[s[left]] == 0:
                    del count[s[left]]
                left += 1
            best = max(best, right - left + 1)
        return best
`.trim();

const SOL_SW_K_DIFFERENT = `
# exactly k distinct = atMost(k) - atMost(k - 1)
class Solution:
    def subarraysWithKDistinct(self, nums, k):
        def at_most(k):
            count, left, res = {}, 0, 0
            for right in range(len(nums)):
                count[nums[right]] = count.get(nums[right], 0) + 1
                while len(count) > k:
                    count[nums[left]] -= 1
                    if count[nums[left]] == 0:
                        del count[nums[left]]
                    left += 1
                res += right - left + 1
            return res
        return at_most(k) - at_most(k - 1)
`.trim();

const SOL_SW_MIN_WINDOW_SUB = `
# Smallest window in s that contains all chars of t
from collections import Counter
class Solution:
    def minWindow(self, s, t):
        if not s or not t:
            return ""
        need = Counter(t)
        missing = len(t)
        left = 0
        best = (float("inf"), 0, 0)
        for right, ch in enumerate(s):
            if need[ch] > 0:
                missing -= 1
            need[ch] -= 1
            while missing == 0:                 # window has everything
                if right - left + 1 < best[0]:
                    best = (right - left + 1, left, right)
                need[s[left]] += 1
                if need[s[left]] > 0:
                    missing += 1
                left += 1
        return "" if best[0] == float("inf") else s[best[1]:best[2] + 1]
`.trim();

const SOL_SW_MIN_WINDOW_SEQ = `
# Smallest window in s1 that contains s2 as a SUBSEQUENCE
class Solution:
    def minWindow(self, s1: str, s2: str) -> str:
        m, n = len(s1), len(s2)
        i, start, best = 0, -1, float("inf")
        while i < m:
            j = 0
            while i < m:                        # forward: find a valid window
                if s1[i] == s2[j]:
                    j += 1
                    if j == n:
                        break
                i += 1
            if j != n:
                break
            end = i
            j = n - 1
            while j >= 0:                       # backward: tighten the start
                if s1[i] == s2[j]:
                    j -= 1
                i -= 1
            i += 1
            if end - i + 1 < best:
                best = end - i + 1
                start = i
            i += 1
        return "" if start == -1 else s1[start:start + best]
`.trim();

// ─── Heap solutions ───────────────────────────────────────────────────────────
const SOL_HEAP_THEORY = `
import heapq
# Python's heapq is a MIN-heap (smallest stays on top)
h = []
heapq.heappush(h, 3)        # O(log n)
heapq.heappush(h, 1)
heapq.heappush(h, 2)
heapq.heappop(h)            # 1  -> removes & returns smallest, O(log n)
h[0]                        # 1  -> peek smallest, O(1)

nums = [5, 3, 8, 1]
heapq.heapify(nums)         # turn a list into a heap in O(n)

# MAX-heap trick: store negatives, negate again on the way out
heapq.heappush(h, -x)
`.trim();

const SOL_HEAP_MIN = `
# Min-heap from scratch: bubble up on insert, sink down on extract
class MinHeap:
    def __init__(self):
        self.h = []

    def insert(self, val):
        self.h.append(val)
        i = len(self.h) - 1
        while i > 0:
            parent = (i - 1) // 2
            if self.h[parent] <= self.h[i]:
                break
            self.h[i], self.h[parent] = self.h[parent], self.h[i]
            i = parent

    def extract_min(self):
        if not self.h:
            return -1
        self.h[0], self.h[-1] = self.h[-1], self.h[0]
        mn = self.h.pop()
        i, n = 0, len(self.h)
        while True:
            smallest, l, r = i, 2 * i + 1, 2 * i + 2
            if l < n and self.h[l] < self.h[smallest]:
                smallest = l
            if r < n and self.h[r] < self.h[smallest]:
                smallest = r
            if smallest == i:
                break
            self.h[i], self.h[smallest] = self.h[smallest], self.h[i]
            i = smallest
        return mn
`.trim();

const SOL_HEAP_KTH_ARRAY = `
# Keep a min-heap of size k -> its top is the k-th largest
import heapq
class Solution:
    def findKthLargest(self, nums, k):
        heap = []
        for x in nums:
            heapq.heappush(heap, x)
            if len(heap) > k:
                heapq.heappop(heap)     # drop the smallest
        return heap[0]
`.trim();

const SOL_HEAP_SORT_K = `
# Each element is at most k spots from its sorted place -> heap of size k+1
import heapq
def sort_k_sorted(arr, k):
    heap = arr[:k + 1]
    heapq.heapify(heap)
    res = []
    for i in range(k + 1, len(arr)):
        res.append(heapq.heappop(heap))
        heapq.heappush(heap, arr[i])
    while heap:
        res.append(heapq.heappop(heap))
    return res
`.trim();

const SOL_HEAP_MERGE_K = `
# Push the head of each list; always pop the global smallest
# (assumes ListNode with .val and .next)
import heapq
class Solution:
    def mergeKLists(self, lists):
        heap = []
        for i, node in enumerate(lists):
            if node:
                heapq.heappush(heap, (node.val, i, node))   # i breaks val ties
        dummy = tail = ListNode()
        while heap:
            val, i, node = heapq.heappop(heap)
            tail.next = node
            tail = tail.next
            if node.next:
                heapq.heappush(heap, (node.next.val, i, node.next))
        return dummy.next
`.trim();

const SOL_HEAP_KTH_STREAM = `
# Maintain a min-heap of the k largest seen so far; top = k-th largest
import heapq
class KthLargest:
    def __init__(self, k, nums):
        self.k = k
        self.heap = nums
        heapq.heapify(self.heap)
        while len(self.heap) > k:
            heapq.heappop(self.heap)

    def add(self, val):
        heapq.heappush(self.heap, val)
        if len(self.heap) > self.k:
            heapq.heappop(self.heap)
        return self.heap[0]
`.trim();

const SOL_HEAP_MAX_SUM_COMBO = `
# Top k sums a[i]+b[j]. Sort desc, explore neighbours from the best pair.
import heapq
def max_sum_combination(a, b, k):
    a.sort(reverse=True)
    b.sort(reverse=True)
    n = len(a)
    seen = {(0, 0)}
    heap = [(-(a[0] + b[0]), 0, 0)]      # max-heap via negation
    res = []
    while heap and len(res) < k:
        neg, i, j = heapq.heappop(heap)
        res.append(-neg)
        if i + 1 < n and (i + 1, j) not in seen:
            seen.add((i + 1, j))
            heapq.heappush(heap, (-(a[i + 1] + b[j]), i + 1, j))
        if j + 1 < n and (i, j + 1) not in seen:
            seen.add((i, j + 1))
            heapq.heappush(heap, (-(a[i] + b[j + 1]), i, j + 1))
    return res
`.trim();

const SOL_HEAP_TOP_K_FREQ = `
# Count frequencies, then take the k highest (nlargest uses a heap)
import heapq
from collections import Counter
class Solution:
    def topKFrequent(self, nums, k):
        freq = Counter(nums)
        return heapq.nlargest(k, freq.keys(), key=freq.get)
`.trim();

// ─── Tree solutions (assume TreeNode with .val, .left, .right) ────────────────
const SOL_TREE_INTRO = `
# A binary tree node
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

#        1
#       / \\
#      2   3
root = TreeNode(1, TreeNode(2), TreeNode(3))
# Each node points to up to two children; the top is the "root".
`.trim();

const SOL_TREE_ALL = `
# Pre + In + Post in ONE pass — a stack of (node, state 1/2/3)
def all_traversals(root):
    pre, ino, post = [], [], []
    if not root:
        return pre, ino, post
    stack = [(root, 1)]
    while stack:
        node, state = stack.pop()
        if state == 1:                 # first touch -> preorder
            pre.append(node.val)
            stack.append((node, 2))
            if node.left:
                stack.append((node.left, 1))
        elif state == 2:               # second touch -> inorder
            ino.append(node.val)
            stack.append((node, 3))
            if node.right:
                stack.append((node.right, 1))
        else:                          # third touch -> postorder
            post.append(node.val)
    return pre, ino, post
`.trim();

const SOL_TREE_PRE = `
# Preorder = Root, Left, Right
class Solution:
    def preorderTraversal(self, root):
        res = []
        def dfs(node):
            if not node:
                return
            res.append(node.val)
            dfs(node.left)
            dfs(node.right)
        dfs(root)
        return res
`.trim();

const SOL_TREE_IN = `
# Inorder = Left, Root, Right  (sorted order for a BST)
class Solution:
    def inorderTraversal(self, root):
        res = []
        def dfs(node):
            if not node:
                return
            dfs(node.left)
            res.append(node.val)
            dfs(node.right)
        dfs(root)
        return res
`.trim();

const SOL_TREE_POST = `
# Postorder = Left, Right, Root
class Solution:
    def postorderTraversal(self, root):
        res = []
        def dfs(node):
            if not node:
                return
            dfs(node.left)
            dfs(node.right)
            res.append(node.val)
        dfs(root)
        return res
`.trim();

const SOL_TREE_LEVEL = `
# BFS level by level using a queue
from collections import deque
class Solution:
    def levelOrder(self, root):
        if not root:
            return []
        res, q = [], deque([root])
        while q:
            level = []
            for _ in range(len(q)):
                node = q.popleft()
                level.append(node.val)
                if node.left:
                    q.append(node.left)
                if node.right:
                    q.append(node.right)
            res.append(level)
        return res
`.trim();

const SOL_TREE_DEPTH = `
# Depth = 1 + deeper of the two subtrees
class Solution:
    def maxDepth(self, root):
        if not root:
            return 0
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))
`.trim();

const SOL_TREE_BALANCED = `
# Return -1 up the tree the moment a subtree is unbalanced
class Solution:
    def isBalanced(self, root):
        def height(node):
            if not node:
                return 0
            lh = height(node.left)
            if lh == -1:
                return -1
            rh = height(node.right)
            if rh == -1:
                return -1
            if abs(lh - rh) > 1:
                return -1
            return 1 + max(lh, rh)
        return height(root) != -1
`.trim();

const SOL_TREE_DIAMETER = `
# Diameter through a node = leftHeight + rightHeight
class Solution:
    def diameterOfBinaryTree(self, root):
        self.best = 0
        def height(node):
            if not node:
                return 0
            lh = height(node.left)
            rh = height(node.right)
            self.best = max(self.best, lh + rh)
            return 1 + max(lh, rh)
        height(root)
        return self.best
`.trim();

const SOL_TREE_MAXPATH = `
# A negative subtree contributes 0; track the best "bent" path at each node
class Solution:
    def maxPathSum(self, root):
        self.best = float("-inf")
        def gain(node):
            if not node:
                return 0
            left = max(gain(node.left), 0)
            right = max(gain(node.right), 0)
            self.best = max(self.best, node.val + left + right)
            return node.val + max(left, right)   # only one side goes up
        gain(root)
        return self.best
`.trim();

const SOL_TREE_ZIGZAG = `
# Level order, but flip direction every level
from collections import deque
class Solution:
    def zigzagLevelOrder(self, root):
        if not root:
            return []
        res, q, l2r = [], deque([root]), True
        while q:
            level = deque()
            for _ in range(len(q)):
                node = q.popleft()
                if l2r:
                    level.append(node.val)
                else:
                    level.appendleft(node.val)
                if node.left:
                    q.append(node.left)
                if node.right:
                    q.append(node.right)
            res.append(list(level))
            l2r = not l2r
        return res
`.trim();

const SOL_TREE_VERTICAL = `
# Group by column (x). Ties broken by row then value.
from collections import defaultdict
class Solution:
    def verticalTraversal(self, root):
        cols = defaultdict(list)        # col -> [(row, val), ...]
        def dfs(node, row, col):
            if not node:
                return
            cols[col].append((row, node.val))
            dfs(node.left, row + 1, col - 1)
            dfs(node.right, row + 1, col + 1)
        dfs(root, 0, 0)
        return [[v for _, v in sorted(cols[c])] for c in sorted(cols)]
`.trim();

const SOL_TREE_RIGHTVIEW = `
# Last node seen at each level (right side). For left view, take the first.
from collections import deque
class Solution:
    def rightSideView(self, root):
        if not root:
            return []
        res, q = [], deque([root])
        while q:
            n = len(q)
            for i in range(n):
                node = q.popleft()
                if i == n - 1:          # rightmost node of this level
                    res.append(node.val)
                if node.left:
                    q.append(node.left)
                if node.right:
                    q.append(node.right)
        return res
`.trim();

// ─── Binary Search Tree solutions ─────────────────────────────────────────────
const SOL_BST_INTRO = `
# A Binary Search Tree keeps things ordered:
#   every value in the LEFT subtree  < node.val
#   every value in the RIGHT subtree > node.val
# That ordering makes search / insert / delete O(h) — O(log n) when balanced.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

#        8
#       / \\
#      3   10        inorder -> 3, 8, 10  (always sorted!)
`.trim();

const SOL_BST_SEARCH = `
# Go left if target is smaller, right if bigger — like binary search
class Solution:
    def searchBST(self, root, val):
        while root and root.val != val:
            root = root.left if val < root.val else root.right
        return root
`.trim();

const SOL_BST_INSERT = `
# Walk down until you find an empty spot, then hang the new node there
class Solution:
    def insertIntoBST(self, root, val):
        if not root:
            return TreeNode(val)
        cur = root
        while True:
            if val < cur.val:
                if not cur.left:
                    cur.left = TreeNode(val)
                    break
                cur = cur.left
            else:
                if not cur.right:
                    cur.right = TreeNode(val)
                    break
                cur = cur.right
        return root
`.trim();

const SOL_BST_DELETE = `
# 0/1 child -> splice it out. 2 children -> replace with inorder successor.
class Solution:
    def deleteNode(self, root, key):
        if not root:
            return None
        if key < root.val:
            root.left = self.deleteNode(root.left, key)
        elif key > root.val:
            root.right = self.deleteNode(root.right, key)
        else:
            if not root.left:
                return root.right
            if not root.right:
                return root.left
            succ = root.right            # smallest value in the right subtree
            while succ.left:
                succ = succ.left
            root.val = succ.val
            root.right = self.deleteNode(root.right, succ.val)
        return root
`.trim();

const SOL_BST_VALIDATE = `
# Carry a valid (low, high) range down; every node must fit inside it
class Solution:
    def isValidBST(self, root):
        def valid(node, low, high):
            if not node:
                return True
            if not (low < node.val < high):
                return False
            return (valid(node.left, low, node.val) and
                    valid(node.right, node.val, high))
        return valid(root, float("-inf"), float("inf"))
`.trim();

// ─── Graph solutions ──────────────────────────────────────────────────────────
const SOL_GRAPH_INTRO = `
# A graph = vertices (nodes) joined by edges.
#   Directed vs Undirected | Weighted vs Unweighted | may contain cycles
# Most-used storage = adjacency list: node -> list of its neighbours
graph = {
    0: [1, 2],
    1: [0, 3],
    2: [0, 3],
    3: [1, 2],
}
# 0 connects to 1 and 2, and so on. Traverse with BFS (queue) or DFS (stack).
`.trim();

const SOL_GRAPH_REPR = `
# Two ways to store a graph of V vertices:

# 1) Adjacency LIST — O(V + E) space, great for sparse graphs
adj = [[] for _ in range(V)]
def add_edge(u, v):              # undirected
    adj[u].append(v)
    adj[v].append(u)

# 2) Adjacency MATRIX — O(V*V) space, O(1) "is there an edge?" lookup
mat = [[0] * V for _ in range(V)]
def add_edge_mat(u, v):
    mat[u][v] = 1
    mat[v][u] = 1
`.trim();

const SOL_GRAPH_COMPONENTS = `
# Count groups of connected nodes — DFS from every unvisited node
def count_components(n, adj):
    seen = [False] * n
    def dfs(u):
        seen[u] = True
        for v in adj[u]:
            if not seen[v]:
                dfs(v)
    count = 0
    for i in range(n):
        if not seen[i]:
            count += 1            # found a brand-new component
            dfs(i)
    return count
`.trim();

const SOL_GRAPH_DFS = `
# Depth-First Search — dive deep, then backtrack
def dfs(start, adj):
    seen, order = set(), []
    def visit(u):
        seen.add(u)
        order.append(u)
        for v in adj[u]:
            if v not in seen:
                visit(v)
    visit(start)
    return order
`.trim();

const SOL_GRAPH_PROVINCES = `
# A province = one connected component in the friendship matrix
class Solution:
    def findCircleNum(self, isConnected):
        n = len(isConnected)
        seen = [False] * n
        def dfs(u):
            seen[u] = True
            for v in range(n):
                if isConnected[u][v] == 1 and not seen[v]:
                    dfs(v)
        provinces = 0
        for i in range(n):
            if not seen[i]:
                provinces += 1
                dfs(i)
        return provinces
`.trim();

const SOL_GRAPH_ROTTEN = `
# Multi-source BFS — all rotten oranges spread at the same time
from collections import deque
class Solution:
    def orangesRotting(self, grid):
        rows, cols = len(grid), len(grid[0])
        q, fresh = deque(), 0
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == 2:
                    q.append((r, c))
                elif grid[r][c] == 1:
                    fresh += 1
        if fresh == 0:
            return 0
        minutes = 0
        dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        while q:
            minutes += 1
            for _ in range(len(q)):
                r, c = q.popleft()
                for dr, dc in dirs:
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                        grid[nr][nc] = 2
                        fresh -= 1
                        q.append((nr, nc))
        return minutes - 1 if fresh == 0 else -1
`.trim();

const SOL_GRAPH_CYCLE_BFS = `
# BFS carrying each node's parent. A visited non-parent neighbour = cycle.
from collections import deque
def has_cycle(n, adj):
    seen = [False] * n
    def bfs(start):
        q = deque([(start, -1)])     # (node, parent)
        seen[start] = True
        while q:
            node, parent = q.popleft()
            for nb in adj[node]:
                if not seen[nb]:
                    seen[nb] = True
                    q.append((nb, node))
                elif nb != parent:
                    return True
        return False
    for i in range(n):
        if not seen[i] and bfs(i):
            return True
    return False
`.trim();

const SOL_GRAPH_SURROUNDED = `
# Any 'O' reachable from the BORDER is safe; everything else gets flipped
class Solution:
    def solve(self, board):
        if not board:
            return
        rows, cols = len(board), len(board[0])
        def dfs(r, c):
            if r < 0 or c < 0 or r >= rows or c >= cols or board[r][c] != "O":
                return
            board[r][c] = "#"                       # mark border-connected
            dfs(r + 1, c); dfs(r - 1, c)
            dfs(r, c + 1); dfs(r, c - 1)
        for r in range(rows):
            dfs(r, 0); dfs(r, cols - 1)
        for c in range(cols):
            dfs(0, c); dfs(rows - 1, c)
        for r in range(rows):
            for c in range(cols):
                if board[r][c] == "O":
                    board[r][c] = "X"               # surrounded -> flip
                elif board[r][c] == "#":
                    board[r][c] = "O"               # safe -> restore
`.trim();

// ─── Graph solutions (advanced) ───────────────────────────────────────────────
const SOL_GRAPH_WORDLADDER = `
# Shortest transformation = BFS over words one letter apart
from collections import deque
class Solution:
    def ladderLength(self, beginWord, endWord, wordList):
        words = set(wordList)
        if endWord not in words:
            return 0
        q = deque([(beginWord, 1)])
        while q:
            word, steps = q.popleft()
            if word == endWord:
                return steps
            for i in range(len(word)):
                for ch in "abcdefghijklmnopqrstuvwxyz":
                    nxt = word[:i] + ch + word[i + 1:]
                    if nxt in words:
                        words.remove(nxt)           # visited
                        q.append((nxt, steps + 1))
        return 0
`.trim();

const SOL_GRAPH_ISLANDS = `
# Each unvisited '1' starts a new island; DFS sinks the whole landmass
class Solution:
    def numIslands(self, grid):
        rows, cols = len(grid), len(grid[0])
        def dfs(r, c):
            if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] != "1":
                return
            grid[r][c] = "0"                        # sink it
            dfs(r + 1, c); dfs(r - 1, c)
            dfs(r, c + 1); dfs(r, c - 1)
        count = 0
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == "1":
                    count += 1
                    dfs(r, c)
        return count
`.trim();

const SOL_GRAPH_DIR_CYCLE_DFS = `
# 3-color DFS: a GRAY (on current path) node seen again = back-edge = cycle
def has_cycle_directed(n, adj):
    WHITE, GRAY, BLACK = 0, 1, 2
    color = [WHITE] * n
    def dfs(u):
        color[u] = GRAY
        for v in adj[u]:
            if color[v] == GRAY:        # back-edge
                return True
            if color[v] == WHITE and dfs(v):
                return True
        color[u] = BLACK
        return False
    return any(color[i] == WHITE and dfs(i) for i in range(n))
`.trim();

const SOL_GRAPH_DETECT_DIR = `
# Kahn's algorithm (BFS topo sort): if not all nodes process, a cycle exists
from collections import deque
def has_cycle_kahn(n, adj):
    indeg = [0] * n
    for u in range(n):
        for v in adj[u]:
            indeg[v] += 1
    q = deque([i for i in range(n) if indeg[i] == 0])
    processed = 0
    while q:
        u = q.popleft()
        processed += 1
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)
    return processed != n               # leftover nodes -> cycle
`.trim();

const SOL_GRAPH_COURSE1 = `
# Can finish all courses? -> the prerequisite graph must be acyclic (Kahn's)
from collections import deque
class Solution:
    def canFinish(self, numCourses, prerequisites):
        adj = [[] for _ in range(numCourses)]
        indeg = [0] * numCourses
        for a, b in prerequisites:      # must take b before a:  b -> a
            adj[b].append(a)
            indeg[a] += 1
        q = deque([i for i in range(numCourses) if indeg[i] == 0])
        done = 0
        while q:
            node = q.popleft()
            done += 1
            for nb in adj[node]:
                indeg[nb] -= 1
                if indeg[nb] == 0:
                    q.append(nb)
        return done == numCourses
`.trim();

const SOL_GRAPH_DAG_SP = `
# Shortest path in a weighted DAG: topo-order, then relax edges in that order
from collections import deque, defaultdict
def shortest_path_dag(n, edges, src):
    adj = defaultdict(list)
    indeg = [0] * n
    for u, v, w in edges:
        adj[u].append((v, w))
        indeg[v] += 1
    q = deque([i for i in range(n) if indeg[i] == 0])
    topo = []
    while q:
        u = q.popleft()
        topo.append(u)
        for v, w in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)
    INF = float("inf")
    dist = [INF] * n
    dist[src] = 0
    for u in topo:
        if dist[u] != INF:
            for v, w in adj[u]:
                if dist[u] + w < dist[v]:
                    dist[v] = dist[u] + w
    return dist
`.trim();

const SOL_GRAPH_DIJKSTRA = `
# Greedy with a min-heap. Non-negative weights only. O(E log V).
import heapq
def dijkstra(n, adj, src):
    # adj[u] = list of (neighbour, weight)
    dist = [float("inf")] * n
    dist[src] = 0
    pq = [(0, src)]                     # (distance so far, node)
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue                    # stale entry
        for v, w in adj[u]:
            if d + w < dist[v]:
                dist[v] = d + w
                heapq.heappush(pq, (dist[v], v))
    return dist
`.trim();

const SOL_GRAPH_BELLMAN = `
# Handles NEGATIVE weights and detects negative cycles. O(V*E).
def bellman_ford(n, edges, src):
    INF = float("inf")
    dist = [INF] * n
    dist[src] = 0
    for _ in range(n - 1):              # relax every edge V-1 times
        for u, v, w in edges:
            if dist[u] != INF and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    for u, v, w in edges:               # one more pass detects a neg cycle
        if dist[u] != INF and dist[u] + w < dist[v]:
            return None
    return dist
`.trim();

// ─── Dynamic Programming solutions ────────────────────────────────────────────
const SOL_DP_INTRO = `
# DP = solve overlapping subproblems ONCE, then reuse the answer.
# Same recurrence, two styles:
from functools import lru_cache

@lru_cache(None)                 # TOP-DOWN (memoization)
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

def fib_tab(n):                  # BOTTOM-UP (tabulation)
    if n < 2:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]
# Naive recursion is O(2^n); DP brings it down to O(n).
`.trim();

const SOL_DP_CLIMB = `
# Ways to reach step n = ways(n-1) + ways(n-2)  (it's Fibonacci!)
class Solution:
    def climbStairs(self, n):
        if n <= 2:
            return n
        a, b = 1, 2
        for _ in range(3, n + 1):
            a, b = b, a + b
        return b
`.trim();

const SOL_DP_ROB = `
# House Robber II — houses in a CIRCLE, so you can't rob both first and last
class Solution:
    def rob(self, nums):
        if len(nums) == 1:
            return nums[0]
        def rob_line(houses):
            take, skip = 0, 0
            for x in houses:
                take, skip = skip + x, max(take, skip)
            return max(take, skip)
        return max(rob_line(nums[1:]), rob_line(nums[:-1]))
`.trim();

const SOL_DP_UNIQUE_PATHS = `
# Paths to a cell = paths from above + paths from left (0 if obstacle)
class Solution:
    def uniquePathsWithObstacles(self, grid):
        m, n = len(grid), len(grid[0])
        dp = [0] * n
        dp[0] = 1
        for i in range(m):
            for j in range(n):
                if grid[i][j] == 1:          # obstacle
                    dp[j] = 0
                elif j > 0:
                    dp[j] += dp[j - 1]
        return dp[-1]
`.trim();

const SOL_DP_MIN_PATH = `
# Minimum Path Sum — only move right or down; take the cheaper incoming cell
class Solution:
    def minPathSum(self, grid):
        m, n = len(grid), len(grid[0])
        dp = [[0] * n for _ in range(m)]
        for i in range(m):
            for j in range(n):
                if i == 0 and j == 0:
                    dp[i][j] = grid[i][j]
                elif i == 0:
                    dp[i][j] = dp[i][j - 1] + grid[i][j]
                elif j == 0:
                    dp[i][j] = dp[i - 1][j] + grid[i][j]
                else:
                    dp[i][j] = min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j]
        return dp[-1][-1]
`.trim();

const SOL_DP_COUNT_SUBSETS = `
# 0/1 knapsack counting — iterate sums DESCENDING so each item is used once
def count_subsets(arr, k):
    dp = [0] * (k + 1)
    dp[0] = 1
    for x in arr:
        for s in range(k, x - 1, -1):
            dp[s] += dp[s - x]
    return dp[k]
`.trim();

const SOL_DP_TARGET_SUM = `
# Assign +/- to each number. Positives form a subset S with
# sum(S) = (total + target) / 2  ->  count subsets with that sum.
class Solution:
    def findTargetSumWays(self, nums, target):
        total = sum(nums)
        if (total + target) % 2 != 0 or abs(target) > total:
            return 0
        s = (total + target) // 2
        dp = [0] * (s + 1)
        dp[0] = 1
        for x in nums:
            for j in range(s, x - 1, -1):
                dp[j] += dp[j - x]
        return dp[s]
`.trim();

const SOL_DP_COIN2 = `
# Count combinations (order doesn't matter) -> coins on the OUTER loop
class Solution:
    def change(self, amount, coins):
        dp = [0] * (amount + 1)
        dp[0] = 1
        for coin in coins:
            for a in range(coin, amount + 1):
                dp[a] += dp[a - coin]
        return dp[amount]
`.trim();

const SOL_DP_LCS = `
# If chars match -> 1 + diagonal; else -> best of dropping one char
class Solution:
    def longestCommonSubsequence(self, text1, text2):
        m, n = len(text1), len(text2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if text1[i - 1] == text2[j - 1]:
                    dp[i][j] = 1 + dp[i - 1][j - 1]
                else:
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
        return dp[m][n]
`.trim();

// ─── Dynamic Programming solutions (more) ─────────────────────────────────────
const SOL_DP_LCSUBSTR = `
# SUBSTRING must be contiguous -> reset to 0 on a mismatch
def longest_common_substring(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    best = 0
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = 1 + dp[i - 1][j - 1]
                best = max(best, dp[i][j])
    return best
`.trim();

const SOL_DP_LPS = `
# Longest palindromic subsequence = LCS of s and its reverse
class Solution:
    def longestPalindromeSubseq(self, s):
        t = s[::-1]
        n = len(s)
        dp = [[0] * (n + 1) for _ in range(n + 1)]
        for i in range(1, n + 1):
            for j in range(1, n + 1):
                if s[i - 1] == t[j - 1]:
                    dp[i][j] = 1 + dp[i - 1][j - 1]
                else:
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
        return dp[n][n]
`.trim();

const SOL_DP_SCS = `
# Build the LCS table, then walk back keeping shared chars once
class Solution:
    def shortestCommonSupersequence(self, s1, s2):
        m, n = len(s1), len(s2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if s1[i - 1] == s2[j - 1]:
                    dp[i][j] = 1 + dp[i - 1][j - 1]
                else:
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
        i, j, res = m, n, []
        while i > 0 and j > 0:
            if s1[i - 1] == s2[j - 1]:
                res.append(s1[i - 1]); i -= 1; j -= 1
            elif dp[i - 1][j] >= dp[i][j - 1]:
                res.append(s1[i - 1]); i -= 1
            else:
                res.append(s2[j - 1]); j -= 1
        while i > 0:
            res.append(s1[i - 1]); i -= 1
        while j > 0:
            res.append(s2[j - 1]); j -= 1
        return "".join(reversed(res))
`.trim();

const SOL_DP_EDIT = `
# Min insert/delete/replace to turn word1 into word2
class Solution:
    def minDistance(self, word1, word2):
        m, n = len(word1), len(word2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(m + 1):
            dp[i][0] = i
        for j in range(n + 1):
            dp[0][j] = j
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if word1[i - 1] == word2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1]
                else:
                    dp[i][j] = 1 + min(dp[i - 1][j],       # delete
                                       dp[i][j - 1],       # insert
                                       dp[i - 1][j - 1])   # replace
        return dp[m][n]
`.trim();

const SOL_DP_STOCK1 = `
# One transaction — track the lowest price seen so far
class Solution:
    def maxProfit(self, prices):
        min_price = float("inf")
        best = 0
        for p in prices:
            min_price = min(min_price, p)
            best = max(best, p - min_price)
        return best
`.trim();

const SOL_DP_STOCK2 = `
# Unlimited transactions — grab every upward step
class Solution:
    def maxProfit(self, prices):
        profit = 0
        for i in range(1, len(prices)):
            if prices[i] > prices[i - 1]:
                profit += prices[i] - prices[i - 1]
        return profit
`.trim();

const SOL_DP_LIS = `
# Patience sorting — 'tails[i]' = smallest tail of an LIS of length i+1
import bisect
class Solution:
    def lengthOfLIS(self, nums):
        tails = []
        for x in nums:
            i = bisect.bisect_left(tails, x)
            if i == len(tails):
                tails.append(x)
            else:
                tails[i] = x
        return len(tails)        # O(n log n)
`.trim();

const SOL_DP_BURST = `
# Interval DP — fix k as the LAST balloon to burst in (left, right)
class Solution:
    def maxCoins(self, nums):
        b = [1] + nums + [1]
        n = len(b)
        dp = [[0] * n for _ in range(n)]
        for length in range(2, n):
            for left in range(0, n - length):
                right = left + length
                for k in range(left + 1, right):
                    dp[left][right] = max(
                        dp[left][right],
                        b[left] * b[k] * b[right] + dp[left][k] + dp[k][right]
                    )
        return dp[0][n - 1]
`.trim();

const SOL_DP_PARTITION = `
# dp[i] = best sum for arr[:i]; try every last block of length 1..k
class Solution:
    def maxSumAfterPartitioning(self, arr, k):
        n = len(arr)
        dp = [0] * (n + 1)
        for i in range(1, n + 1):
            cur_max = 0
            for j in range(1, min(k, i) + 1):
                cur_max = max(cur_max, arr[i - j])
                dp[i] = max(dp[i], dp[i - j] + cur_max * j)
        return dp[n]
`.trim();

// ─── Basics solutions ─────────────────────────────────────────────────────────
const SOL_B_IO = `
# Reading input
name = input()                          # one line as a string
n = int(input())                        # a single integer
a, b = map(int, input().split())        # two ints on one line
nums = list(map(int, input().split()))  # a whole list of ints

# Printing output
print("Hello", name)
print(a + b)
print(*nums)                            # print a list, space-separated
print(f"{a} + {b} = {a + b}")           # f-string formatting
`.trim();

const SOL_B_IFELSE = `
# if / elif / else — only one branch runs
n = int(input())
if n % 2 == 1:
    print("Weird")
elif 2 <= n <= 5:
    print("Not Weird")
elif 6 <= n <= 20:
    print("Weird")
else:
    print("Not Weird")
`.trim();

const SOL_B_SWITCH = `
# Python has NO 'switch'. Two idiomatic alternatives:

# 1) dict dispatch
def run(op, a, b):
    return {
        "+": a + b,
        "-": a - b,
        "*": a * b,
    }.get(op)

# 2) match-case (Python 3.10+)
def classify(x):
    match x:
        case 0:
            return "zero"
        case 1 | 2 | 3:
            return "small"
        case _:
            return "big"
`.trim();

const SOL_B_FOR = `
# range-based loop
n = int(input())
for i in range(n):
    print(i * i)

# loop over items, and over (index, item) pairs
for item in [10, 20, 30]:
    print(item)
for idx, item in enumerate(["a", "b"]):
    print(idx, item)
`.trim();

const SOL_B_WHILE = `
# Repeat while a condition stays true
n = 5
while n > 0:
    print(n)
    n -= 1

# Read until a sentinel value
total = 0
while True:
    x = int(input())
    if x == -1:
        break
    total += x
`.trim();

const SOL_B_FUNCTIONS = `
# Python passes arguments by OBJECT REFERENCE.
def add(a, b):
    return a + b

# Mutable args (list/dict) can be changed in place -> caller sees it
def append_one(lst):
    lst.append(1)

# Reassigning only rebinds the local name -> caller is unaffected
def rebind(lst):
    lst = [9, 9]

nums = [0]
append_one(nums)        # nums -> [0, 1]
rebind(nums)            # nums still [0, 1]
# Immutable args (int, str, tuple) always behave "by value".
`.trim();

const SOL_B_PATTERNS = `
# Nested loops build patterns — the outer loop = rows, inner = columns
n = 5

# Right-angled triangle
for i in range(1, n + 1):
    print("*" * i)

# Centered pyramid
for i in range(1, n + 1):
    print(" " * (n - i) + "*" * (2 * i - 1))
`.trim();

// ─── Basics: collections, maths, recursion, arrays/strings ────────────────────
const SOL_B_COLLECTIONS = `
from collections import deque, Counter, defaultdict

# deque — O(1) appends/pops at BOTH ends (use as a queue or stack)
dq = deque([1, 2, 3]); dq.appendleft(0); dq.pop()

# Counter — count occurrences instantly
Counter("banana")            # {'a': 3, 'n': 2, 'b': 1}

# defaultdict — auto-creates a default for missing keys
g = defaultdict(list); g[1].append(2)

# Also worth knowing: heapq (min-heap), bisect (binary search on sorted list)
# Core built-ins: list, tuple, dict, set
`.trim();

const SOL_M_COUNT_DIGITS = `
def count_digits(n):
    n = abs(n)
    count = 0
    while n > 0:
        count += 1
        n //= 10
    return count if count else 1     # 0 itself has one digit
# one-liner: len(str(abs(n)))
`.trim();

const SOL_M_REVERSE_NUM = `
def reverse_number(n):
    rev = 0
    while n > 0:
        rev = rev * 10 + n % 10      # peel last digit, append to rev
        n //= 10
    return rev
`.trim();

const SOL_M_PALINDROME_NUM = `
class Solution:
    def isPalindrome(self, x: int) -> bool:
        if x < 0:
            return False
        s = str(x)
        return s == s[::-1]
`.trim();

const SOL_M_GCD = `
# Euclid's algorithm — O(log(min(a, b)))
def gcd(a, b):
    while b:
        a, b = b, a % b
    return a
`.trim();

const SOL_M_ARMSTRONG = `
# Armstrong: sum of each digit raised to (number of digits) equals the number
def is_armstrong(n):
    digits = str(n)
    power = len(digits)
    return n == sum(int(d) ** power for d in digits)
`.trim();

const SOL_M_DIVISORS = `
# Pair up i and n//i -> only loop to sqrt(n)
def print_divisors(n):
    res = []
    i = 1
    while i * i <= n:
        if n % i == 0:
            res.append(i)
            if i != n // i:
                res.append(n // i)
        i += 1
    return sorted(res)
`.trim();

const SOL_M_PRIME = `
# Only check factors up to sqrt(n)
def is_prime(n):
    if n < 2:
        return False
    i = 2
    while i * i <= n:
        if n % i == 0:
            return False
        i += 1
    return True
`.trim();

const SOL_R_PRINT_N = `
# The shape of every recursion: a base case + a call on a smaller problem
def print_n_times(n, i=1):
    if i > n:            # base case -> stop
        return
    print("GFG")
    print_n_times(n, i + 1)
`.trim();

const SOL_R_PRINT_NAME = `
def print_name(n, i=1):
    if i > n:
        return
    print("Name")
    print_name(n, i + 1)
`.trim();

const SOL_R_1_TO_N = `
def print_1_to_n(n, i=1):
    if i > n:
        return
    print(i)
    print_1_to_n(n, i + 1)
`.trim();

const SOL_R_N_TO_1 = `
def print_n_to_1(n):
    if n < 1:
        return
    print(n)
    print_n_to_1(n - 1)
`.trim();

const SOL_R_SUM_N = `
def sum_first_n(n):
    if n == 0:
        return 0
    return n + sum_first_n(n - 1)
# closed form: n * (n + 1) // 2
`.trim();

const SOL_R_FACTORIAL = `
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)
`.trim();

const SOL_AS_REVERSE_ARR = `
# Two pointers swapping inward
def reverse_array(arr):
    l, r = 0, len(arr) - 1
    while l < r:
        arr[l], arr[r] = arr[r], arr[l]
        l += 1
        r -= 1
    return arr
# Pythonic one-liner: arr[::-1]
`.trim();

const SOL_AS_STR_PALINDROME = `
def is_palindrome(s):
    l, r = 0, len(s) - 1
    while l < r:
        if s[l] != s[r]:
            return False
        l += 1
        r -= 1
    return True
# one-liner: s == s[::-1]
`.trim();

// ─── Basics: fibonacci, hashing, sorting ──────────────────────────────────────
const SOL_R_FIB = `
class Solution:
    def fib(self, n: int) -> int:
        if n < 2:
            return n
        a, b = 0, 1
        for _ in range(2, n + 1):
            a, b = b, a + b
        return b
`.trim();

const SOL_H_BASIC = `
# Hashing maps a key -> a slot, giving O(1) average lookup/insert/delete.
# In Python, dict and set ARE hash tables.
freq = {}
for x in [1, 2, 2, 3]:
    freq[x] = freq.get(x, 0) + 1     # manual frequency map

from collections import Counter
Counter([1, 2, 2, 3])                # {2: 2, 1: 1, 3: 1}

seen = set()
seen.add(5)
print(5 in seen)                     # True  -> O(1) membership
`.trim();

const SOL_H_COUNT_FREQ = `
# Build a frequency map in O(n) with Counter
from collections import Counter
def count_frequencies(arr):
    freq = Counter(arr)              # element -> how many times it appears
    for val, c in freq.items():
        print(val, "->", c)
    return freq
# Most frequent count: max(freq.values())
`.trim();

const SOL_H_HIGHEST = `
# Highest occurring element = the mode (largest frequency)
from collections import Counter
def highest_occurring(arr):
    freq = Counter(arr)
    return max(freq, key=freq.get)   # element with the biggest count
`.trim();

const SOL_SRT_SELECTION = `
# Pick the smallest from the unsorted part, swap it to the front. O(n^2)
def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        mn = i
        for j in range(i + 1, n):
            if arr[j] < arr[mn]:
                mn = j
        arr[i], arr[mn] = arr[mn], arr[i]
    return arr
`.trim();

const SOL_SRT_BUBBLE = `
# Swap adjacent out-of-order pairs; the biggest "bubbles" to the end. O(n^2)
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:              # already sorted -> stop early
            break
    return arr
`.trim();

const SOL_SRT_INSERTION = `
# Insert each element into its place in the sorted-so-far part. O(n^2)
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr
`.trim();

const SOL_SRT_MERGE = `
# Divide in half, sort each, merge the two sorted halves. O(n log n)
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    merged, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i]); i += 1
        else:
            merged.append(right[j]); j += 1
    merged.extend(left[i:])
    merged.extend(right[j:])
    return merged
`.trim();

const SOL_SRT_REC_BUBBLE = `
# Bubble the largest to the end, then recurse on the smaller prefix
def recursive_bubble(arr, n=None):
    if n is None:
        n = len(arr)
    if n == 1:
        return arr
    for j in range(n - 1):
        if arr[j] > arr[j + 1]:
            arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return recursive_bubble(arr, n - 1)
`.trim();

const SOL_SRT_REC_INSERTION = `
# Insert arr[i] into the sorted prefix, then recurse on i+1
def recursive_insertion(arr, i=1):
    if i >= len(arr):
        return arr
    key = arr[i]
    j = i - 1
    while j >= 0 and arr[j] > key:
        arr[j + 1] = arr[j]
        j -= 1
    arr[j + 1] = key
    return recursive_insertion(arr, i + 1)
`.trim();

const SOL_SRT_QUICK = `
# Partition around a pivot (smaller left / bigger right), recurse. O(n log n) avg
def quick_sort(arr, lo=0, hi=None):
    if hi is None:
        hi = len(arr) - 1
    if lo < hi:
        p = partition(arr, lo, hi)
        quick_sort(arr, lo, p - 1)
        quick_sort(arr, p + 1, hi)
    return arr

def partition(arr, lo, hi):
    pivot = arr[hi]
    i = lo - 1
    for j in range(lo, hi):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[hi] = arr[hi], arr[i + 1]
    return i + 1
`.trim();

// ─── Arrays (easy) solutions ──────────────────────────────────────────────────
const SOL_ARR_LARGEST = `
def largest_element(arr):
    largest = arr[0]
    for x in arr:
        if x > largest:
            largest = x
    return largest
# Pythonic: max(arr)
`.trim();

const SOL_ARR_SECOND = `
# Track largest and second-largest in a single pass
def second_largest(arr):
    largest = second = float("-inf")
    for x in arr:
        if x > largest:
            second = largest
            largest = x
        elif largest > x > second:
            second = x
    return second if second != float("-inf") else -1
`.trim();

const SOL_ARR_SORTED = `
def is_sorted(arr):
    for i in range(1, len(arr)):
        if arr[i] < arr[i - 1]:
            return False
    return True
`.trim();

const SOL_ARR_REMOVE_DUP = `
# Two pointers — 'k' is where the next unique value goes
class Solution:
    def removeDuplicates(self, nums):
        if not nums:
            return 0
        k = 1
        for i in range(1, len(nums)):
            if nums[i] != nums[k - 1]:
                nums[k] = nums[i]
                k += 1
        return k                     # length of the unique prefix
`.trim();

const SOL_ARR_ROTATE1 = `
# Left-rotate by one: remember the first, shift left, put it at the end
def rotate_by_one(arr):
    if not arr:
        return arr
    first = arr[0]
    for i in range(len(arr) - 1):
        arr[i] = arr[i + 1]
    arr[-1] = first
    return arr
`.trim();

const SOL_ARR_ROTATEK = `
# Left-rotate by k using 3 reversals — O(n) time, O(1) space
def left_rotate(arr, k):
    n = len(arr)
    k %= n
    def reverse(lo, hi):
        while lo < hi:
            arr[lo], arr[hi] = arr[hi], arr[lo]
            lo += 1
            hi -= 1
    reverse(0, k - 1)
    reverse(k, n - 1)
    reverse(0, n - 1)
    return arr
# (LeetCode 189 rotates RIGHT by k -> reverse whole first, then the two halves.)
`.trim();

const SOL_ARR_MOVE_ZERO = `
# 'j' marks the next slot for a non-zero; swap them forward
class Solution:
    def moveZeroes(self, nums):
        j = 0
        for i in range(len(nums)):
            if nums[i] != 0:
                nums[i], nums[j] = nums[j], nums[i]
                j += 1
`.trim();

const SOL_ARR_LINEAR = `
def linear_search(arr, target):
    for i, x in enumerate(arr):
        if x == target:
            return i
    return -1                        # not found, O(n)
`.trim();

const SOL_ARR_UNION = `
# Merge like merge-sort, skipping duplicates
def union_sorted(a, b):
    i = j = 0
    res = []
    while i < len(a) and j < len(b):
        if a[i] < b[j]:
            val = a[i]; i += 1
        elif a[i] > b[j]:
            val = b[j]; j += 1
        else:
            val = a[i]; i += 1; j += 1
        if not res or res[-1] != val:
            res.append(val)
    while i < len(a):
        if not res or res[-1] != a[i]:
            res.append(a[i])
        i += 1
    while j < len(b):
        if not res or res[-1] != b[j]:
            res.append(b[j])
        j += 1
    return res
`.trim();

const SOL_ARR_MISSING = `
# Sum of 0..n minus the actual sum = the missing number
class Solution:
    def missingNumber(self, nums):
        n = len(nums)
        return n * (n + 1) // 2 - sum(nums)
`.trim();

// ─── Arrays (medium) solutions ────────────────────────────────────────────────
const SOL_ARR_TWOSUM = `
# Store each value in a hash map; check if its complement was seen
class Solution:
    def twoSum(self, nums, target):
        seen = {}
        for i, x in enumerate(nums):
            if target - x in seen:
                return [seen[target - x], i]
            seen[x] = i
`.trim();

const SOL_ARR_SORT012 = `
# Dutch National Flag — three pointers, one pass, O(1) space
def sort012(arr):
    low = mid = 0
    high = len(arr) - 1
    while mid <= high:
        if arr[mid] == 0:
            arr[low], arr[mid] = arr[mid], arr[low]
            low += 1; mid += 1
        elif arr[mid] == 1:
            mid += 1
        else:
            arr[mid], arr[high] = arr[high], arr[mid]
            high -= 1
    return arr
`.trim();

const SOL_ARR_MAJORITY = `
# Boyer-Moore voting — the majority element survives the cancellations
class Solution:
    def majorityElement(self, nums):
        count, candidate = 0, None
        for x in nums:
            if count == 0:
                candidate = x
            count += 1 if x == candidate else -1
        return candidate
`.trim();

const SOL_ARR_KADANE = `
# Kadane's — extend the running sum, or restart at the current element
class Solution:
    def maxSubArray(self, nums):
        best = cur = nums[0]
        for x in nums[1:]:
            cur = max(x, cur + x)
            best = max(best, cur)
        return best
`.trim();

const SOL_ARR_PRINT_MAXSUB = `
# Kadane's, but also remember WHERE the best subarray starts/ends
def max_subarray(nums):
    best = cur = nums[0]
    start = best_l = best_r = 0
    for i in range(1, len(nums)):
        if cur + nums[i] < nums[i]:
            cur = nums[i]
            start = i
        else:
            cur += nums[i]
        if cur > best:
            best = cur
            best_l, best_r = start, i
    return nums[best_l:best_r + 1]
`.trim();

const SOL_ARR_STOCK = `
# Track the cheapest price so far; best profit = today - cheapest
class Solution:
    def maxProfit(self, prices):
        min_price = float("inf")
        best = 0
        for p in prices:
            min_price = min(min_price, p)
            best = max(best, p - min_price)
        return best
`.trim();

const SOL_ARR_REARRANGE = `
# Positives go to even indices, negatives to odd (equal counts)
class Solution:
    def rearrangeArray(self, nums):
        res = [0] * len(nums)
        pos, neg = 0, 1
        for x in nums:
            if x > 0:
                res[pos] = x; pos += 2
            else:
                res[neg] = x; neg += 2
        return res
`.trim();

const SOL_ARR_NEXTPERM = `
# Find the rightmost ascent, swap with next-bigger, reverse the suffix
class Solution:
    def nextPermutation(self, nums):
        n = len(nums)
        i = n - 2
        while i >= 0 and nums[i] >= nums[i + 1]:
            i -= 1
        if i >= 0:
            j = n - 1
            while nums[j] <= nums[i]:
                j -= 1
            nums[i], nums[j] = nums[j], nums[i]
        nums[i + 1:] = reversed(nums[i + 1:])
`.trim();

const SOL_ARR_LEADERS = `
# Scan from the right; a leader is bigger than everything to its right
def leaders(arr):
    res = []
    max_right = float("-inf")
    for x in reversed(arr):
        if x >= max_right:
            res.append(x)
            max_right = x
    return res[::-1]
`.trim();

// ─── Arrays (hard) solutions ──────────────────────────────────────────────────
const SOL_ARR_LCS_SEQ = `
# Put everything in a set; only start counting at a streak's beginning
class Solution:
    def longestConsecutive(self, nums):
        s = set(nums)
        best = 0
        for x in s:
            if x - 1 not in s:           # x is the start of a run
                length = 1
                while x + length in s:
                    length += 1
                best = max(best, length)
        return best
`.trim();

const SOL_ARR_SET_ZEROES = `
# Use row 0 and col 0 as markers -> O(1) extra space
class Solution:
    def setZeroes(self, matrix):
        rows, cols = len(matrix), len(matrix[0])
        first_row = any(matrix[0][c] == 0 for c in range(cols))
        first_col = any(matrix[r][0] == 0 for r in range(rows))
        for r in range(1, rows):
            for c in range(1, cols):
                if matrix[r][c] == 0:
                    matrix[r][0] = 0
                    matrix[0][c] = 0
        for r in range(1, rows):
            for c in range(1, cols):
                if matrix[r][0] == 0 or matrix[0][c] == 0:
                    matrix[r][c] = 0
        if first_row:
            for c in range(cols):
                matrix[0][c] = 0
        if first_col:
            for r in range(rows):
                matrix[r][0] = 0
`.trim();

const SOL_ARR_ROTATE_IMG = `
# Rotate 90 clockwise = transpose, then reverse each row
class Solution:
    def rotate(self, matrix):
        n = len(matrix)
        for i in range(n):
            for j in range(i + 1, n):
                matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
        for row in matrix:
            row.reverse()
`.trim();

const SOL_ARR_SPIRAL = `
# Peel layers: top row, right col, bottom row, left col — shrink bounds
class Solution:
    def spiralOrder(self, matrix):
        res = []
        top, bottom = 0, len(matrix) - 1
        left, right = 0, len(matrix[0]) - 1
        while top <= bottom and left <= right:
            for c in range(left, right + 1):
                res.append(matrix[top][c])
            top += 1
            for r in range(top, bottom + 1):
                res.append(matrix[r][right])
            right -= 1
            if top <= bottom:
                for c in range(right, left - 1, -1):
                    res.append(matrix[bottom][c])
                bottom -= 1
            if left <= right:
                for r in range(bottom, top - 1, -1):
                    res.append(matrix[r][left])
                left += 1
        return res
`.trim();

const SOL_ARR_COUNT_SUB = `
# Prefix sum + hashmap: count earlier prefixes equal to (total - k)
from collections import defaultdict
def count_subarrays(arr, k):
    prefix = defaultdict(int)
    prefix[0] = 1
    total = count = 0
    for x in arr:
        total += x
        count += prefix[total - k]
        prefix[total] += 1
    return count
`.trim();

const SOL_ARR_PASCAL = `
# Each value = sum of the two above it
class Solution:
    def generate(self, numRows):
        res = [[1]]
        for i in range(1, numRows):
            prev = res[-1]
            row = [1]
            for j in range(1, i):
                row.append(prev[j - 1] + prev[j])
            row.append(1)
            res.append(row)
        return res
`.trim();

const SOL_ARR_MAJORITY2 = `
# Boyer-Moore for > n/3 -> at most TWO candidates
class Solution:
    def majorityElement(self, nums):
        c1 = c2 = 0
        cand1 = cand2 = None
        for x in nums:
            if x == cand1:
                c1 += 1
            elif x == cand2:
                c2 += 1
            elif c1 == 0:
                cand1, c1 = x, 1
            elif c2 == 0:
                cand2, c2 = x, 1
            else:
                c1 -= 1
                c2 -= 1
        return [c for c in {cand1, cand2}
                if c is not None and nums.count(c) > len(nums) // 3]
`.trim();

const SOL_ARR_3SUM = `
# Sort, fix one element, two-pointer the rest; skip duplicates
class Solution:
    def threeSum(self, nums):
        nums.sort()
        res, n = [], len(nums)
        for i in range(n):
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            l, r = i + 1, n - 1
            while l < r:
                s = nums[i] + nums[l] + nums[r]
                if s < 0:
                    l += 1
                elif s > 0:
                    r -= 1
                else:
                    res.append([nums[i], nums[l], nums[r]])
                    l += 1; r -= 1
                    while l < r and nums[l] == nums[l - 1]:
                        l += 1
                    while l < r and nums[r] == nums[r + 1]:
                        r -= 1
        return res
`.trim();

const SOL_ARR_4SUM = `
# Two fixed loops + two-pointer; skip duplicates at every level
class Solution:
    def fourSum(self, nums, target):
        nums.sort()
        n, res = len(nums), []
        for i in range(n):
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            for j in range(i + 1, n):
                if j > i + 1 and nums[j] == nums[j - 1]:
                    continue
                l, r = j + 1, n - 1
                while l < r:
                    s = nums[i] + nums[j] + nums[l] + nums[r]
                    if s < target:
                        l += 1
                    elif s > target:
                        r -= 1
                    else:
                        res.append([nums[i], nums[j], nums[l], nums[r]])
                        l += 1; r -= 1
                        while l < r and nums[l] == nums[l - 1]:
                            l += 1
                        while l < r and nums[r] == nums[r + 1]:
                            r -= 1
        return res
`.trim();

// ─── Arrays (hard, part 2) solutions ──────────────────────────────────────────
const SOL_ARR_SUBSUM0 = `
# Same prefix sum seen twice -> the chunk between them sums to 0
def largest_subarray_sum_zero(arr):
    seen = {}
    total = best = 0
    for i, x in enumerate(arr):
        total += x
        if total == 0:
            best = i + 1
        elif total in seen:
            best = max(best, i - seen[total])
        else:
            seen[total] = i      # store earliest index only
    return best
`.trim();

const SOL_ARR_XORK = `
# prefix_xor ^ k must have appeared before -> count those
from collections import defaultdict
def count_subarrays_xor(arr, k):
    freq = defaultdict(int)
    freq[0] = 1
    xor = count = 0
    for x in arr:
        xor ^= x
        count += freq[xor ^ k]
        freq[xor] += 1
    return count
`.trim();

const SOL_ARR_MERGE_INT = `
# Sort by start; extend the last interval if it overlaps
class Solution:
    def merge(self, intervals):
        intervals.sort(key=lambda x: x[0])
        res = []
        for start, end in intervals:
            if res and start <= res[-1][1]:
                res[-1][1] = max(res[-1][1], end)
            else:
                res.append([start, end])
        return res
`.trim();

const SOL_ARR_MERGE_SORTED = `
# Fill nums1 from the BACK so we never overwrite unmerged values
class Solution:
    def merge(self, nums1, m, nums2, n):
        i, j, k = m - 1, n - 1, m + n - 1
        while j >= 0:
            if i >= 0 and nums1[i] > nums2[j]:
                nums1[k] = nums1[i]; i -= 1
            else:
                nums1[k] = nums2[j]; j -= 1
            k -= 1
`.trim();

const SOL_ARR_REPEAT_MISSING = `
# Count occurrences 1..n*n -> the one seen twice and the one never seen
class Solution:
    def findMissingAndRepeatedValues(self, grid):
        n = len(grid)
        total = n * n
        seen = [0] * (total + 1)
        for row in grid:
            for v in row:
                seen[v] += 1
        repeat = missing = -1
        for v in range(1, total + 1):
            if seen[v] == 2:
                repeat = v
            elif seen[v] == 0:
                missing = v
        return [repeat, missing]
`.trim();

const SOL_ARR_INVERSIONS = `
# Count pairs (i<j, a[i]>a[j]) while merge-sorting -> O(n log n)
def count_inversions(arr):
    def sort_count(a):
        if len(a) <= 1:
            return a, 0
        mid = len(a) // 2
        left, lc = sort_count(a[:mid])
        right, rc = sort_count(a[mid:])
        merged, i, j, cross = [], 0, 0, 0
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                merged.append(left[i]); i += 1
            else:
                merged.append(right[j]); j += 1
                cross += len(left) - i      # all remaining left > right[j]
        merged.extend(left[i:])
        merged.extend(right[j:])
        return merged, lc + rc + cross
    return sort_count(arr)[1]
`.trim();

const SOL_ARR_REVERSE_PAIRS = `
# Like inversions, but count pairs where a[i] > 2*a[j] (merge sort)
class Solution:
    def reversePairs(self, nums):
        def sort_count(lo, hi):
            if lo >= hi:
                return 0
            mid = (lo + hi) // 2
            count = sort_count(lo, mid) + sort_count(mid + 1, hi)
            j = mid + 1
            for i in range(lo, mid + 1):
                while j <= hi and nums[i] > 2 * nums[j]:
                    j += 1
                count += j - (mid + 1)
            nums[lo:hi + 1] = sorted(nums[lo:hi + 1])
            return count
        return sort_count(0, len(nums) - 1)
`.trim();

const SOL_ARR_MAX_PRODUCT = `
# Track BOTH max and min (a negative can flip them)
class Solution:
    def maxProduct(self, nums):
        best = cur_max = cur_min = nums[0]
        for x in nums[1:]:
            options = (x, cur_max * x, cur_min * x)
            cur_max = max(options)
            cur_min = min(options)
            best = max(best, cur_max)
        return best
`.trim();

// ─── Binary Search solutions ──────────────────────────────────────────────────
const SOL_BS_SEARCH = `
# Classic binary search on a sorted array — O(log n)
class Solution:
    def search(self, nums, target):
        lo, hi = 0, len(nums) - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                lo = mid + 1
            else:
                hi = mid - 1
        return -1
`.trim();

const SOL_BS_LOWER = `
# Lower bound = first index with arr[i] >= x
def lower_bound(arr, x):
    lo, hi, ans = 0, len(arr), len(arr)
    while lo < hi:
        mid = (lo + hi) // 2
        if arr[mid] >= x:
            ans = mid
            hi = mid
        else:
            lo = mid + 1
    return ans
`.trim();

const SOL_BS_UPPER = `
# Upper bound = first index with arr[i] > x
def upper_bound(arr, x):
    lo, hi, ans = 0, len(arr), len(arr)
    while lo < hi:
        mid = (lo + hi) // 2
        if arr[mid] > x:
            ans = mid
            hi = mid
        else:
            lo = mid + 1
    return ans
`.trim();

const SOL_BS_INSERT = `
# Where would target go to keep the array sorted? (= lower bound)
class Solution:
    def searchInsert(self, nums, target):
        lo, hi = 0, len(nums)
        while lo < hi:
            mid = (lo + hi) // 2
            if nums[mid] < target:
                lo = mid + 1
            else:
                hi = mid
        return lo
`.trim();

const SOL_BS_FLOOR_CEIL = `
# Floor = largest value <= x ; Ceil = smallest value >= x
def floor_ceil(arr, x):
    floor = ceil = -1
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == x:
            return arr[mid], arr[mid]
        elif arr[mid] < x:
            floor = arr[mid]
            lo = mid + 1
        else:
            ceil = arr[mid]
            hi = mid - 1
    return floor, ceil
`.trim();

const SOL_BS_FIRST_LAST = `
# Two binary searches: one biased left, one biased right
class Solution:
    def searchRange(self, nums, target):
        def bound(is_lower):
            lo, hi, res = 0, len(nums) - 1, -1
            while lo <= hi:
                mid = (lo + hi) // 2
                if nums[mid] == target:
                    res = mid
                    if is_lower:
                        hi = mid - 1
                    else:
                        lo = mid + 1
                elif nums[mid] < target:
                    lo = mid + 1
                else:
                    hi = mid - 1
            return res
        return [bound(True), bound(False)]
`.trim();

const SOL_BS_COUNT = `
# Count = lowerBound(x+1) - lowerBound(x)
def count_occurrences(arr, x):
    def lower_bound(val):
        lo, hi, ans = 0, len(arr), len(arr)
        while lo < hi:
            mid = (lo + hi) // 2
            if arr[mid] >= val:
                ans = mid; hi = mid
            else:
                lo = mid + 1
        return ans
    first = lower_bound(x)
    if first == len(arr) or arr[first] != x:
        return 0
    return lower_bound(x + 1) - first
`.trim();

const SOL_BS_ROTATED1 = `
# One half is always sorted — decide which, then narrow into it
class Solution:
    def search(self, nums, target):
        lo, hi = 0, len(nums) - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            if nums[mid] == target:
                return mid
            if nums[lo] <= nums[mid]:                # left half sorted
                if nums[lo] <= target < nums[mid]:
                    hi = mid - 1
                else:
                    lo = mid + 1
            else:                                    # right half sorted
                if nums[mid] < target <= nums[hi]:
                    lo = mid + 1
                else:
                    hi = mid - 1
        return -1
`.trim();

const SOL_BS_ROTATED2 = `
# Duplicates can hide which half is sorted -> shrink both ends when ambiguous
class Solution:
    def search(self, nums, target):
        lo, hi = 0, len(nums) - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            if nums[mid] == target:
                return True
            if nums[lo] == nums[mid] == nums[hi]:
                lo += 1
                hi -= 1
            elif nums[lo] <= nums[mid]:
                if nums[lo] <= target < nums[mid]:
                    hi = mid - 1
                else:
                    lo = mid + 1
            else:
                if nums[mid] < target <= nums[hi]:
                    lo = mid + 1
                else:
                    hi = mid - 1
        return False
`.trim();

const SOL_BS_FIND_MIN = `
# The minimum sits where the rotation "breaks"
class Solution:
    def findMin(self, nums):
        lo, hi = 0, len(nums) - 1
        while lo < hi:
            mid = (lo + hi) // 2
            if nums[mid] > nums[hi]:        # min is to the right
                lo = mid + 1
            else:
                hi = mid
        return nums[lo]
`.trim();

const SOL_BS_COUNT_ROT = `
# Rotation count = index of the minimum element
def count_rotations(arr):
    lo, hi = 0, len(arr) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if arr[mid] > arr[hi]:
            lo = mid + 1
        else:
            hi = mid
    return lo
`.trim();

const SOL_BS_SINGLE = `
# Pairs sit at (even, odd). The single element breaks that pattern.
class Solution:
    def singleNonDuplicate(self, nums):
        lo, hi = 0, len(nums) - 1
        while lo < hi:
            mid = (lo + hi) // 2
            if mid % 2 == 1:
                mid -= 1                  # align to the even index
            if nums[mid] == nums[mid + 1]:
                lo = mid + 2
            else:
                hi = mid
        return nums[lo]
`.trim();

const SOL_BS_PEAK = `
# Walk uphill: move toward the bigger neighbour -> always lands on a peak
class Solution:
    def findPeakElement(self, nums):
        lo, hi = 0, len(nums) - 1
        while lo < hi:
            mid = (lo + hi) // 2
            if nums[mid] > nums[mid + 1]:
                hi = mid
            else:
                lo = mid + 1
        return lo
`.trim();

// ─── Binary Search on Answers solutions ───────────────────────────────────────
const SOL_BS_SQRT = `
# Search the answer space [0, n] for the largest mid with mid*mid <= n
def my_sqrt(n):
    lo, hi, ans = 0, n, 0
    while lo <= hi:
        mid = (lo + hi) // 2
        if mid * mid <= n:
            ans = mid
            lo = mid + 1
        else:
            hi = mid - 1
    return ans          # floor of the square root
`.trim();

const SOL_BS_NTH_ROOT = `
def nth_root(n, m):
    lo, hi = 1, m
    while lo <= hi:
        mid = (lo + hi) // 2
        power = mid ** n
        if power == m:
            return mid
        elif power < m:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
`.trim();

const SOL_BS_KOKO = `
# Binary-search the eating speed; feasible speeds form a sorted boundary
import math
class Solution:
    def minEatingSpeed(self, piles, h):
        lo, hi = 1, max(piles)
        while lo < hi:
            mid = (lo + hi) // 2
            hours = sum(math.ceil(p / mid) for p in piles)
            if hours <= h:
                hi = mid          # this speed works -> try slower
            else:
                lo = mid + 1
        return lo
`.trim();

const SOL_BS_BOUQUETS = `
# Binary-search the day; check if M bouquets of K adjacent flowers are ready
class Solution:
    def minDays(self, bloomDay, m, k):
        if m * k > len(bloomDay):
            return -1
        def can(day):
            bouquets = flowers = 0
            for b in bloomDay:
                if b <= day:
                    flowers += 1
                    if flowers == k:
                        bouquets += 1
                        flowers = 0
                else:
                    flowers = 0
            return bouquets >= m
        lo, hi = min(bloomDay), max(bloomDay)
        while lo < hi:
            mid = (lo + hi) // 2
            if can(mid):
                hi = mid
            else:
                lo = mid + 1
        return lo
`.trim();

const SOL_BS_DIVISOR = `
# Binary-search the divisor; bigger divisor -> smaller sum of ceils
import math
class Solution:
    def smallestDivisor(self, nums, threshold):
        lo, hi = 1, max(nums)
        while lo < hi:
            mid = (lo + hi) // 2
            total = sum(math.ceil(x / mid) for x in nums)
            if total <= threshold:
                hi = mid
            else:
                lo = mid + 1
        return lo
`.trim();

const SOL_BS_SHIP = `
# Binary-search the ship capacity; greedily count days it needs
class Solution:
    def shipWithinDays(self, weights, days):
        def needed(cap):
            d, cur = 1, 0
            for w in weights:
                if cur + w > cap:
                    d += 1
                    cur = 0
                cur += w
            return d
        lo, hi = max(weights), sum(weights)
        while lo < hi:
            mid = (lo + hi) // 2
            if needed(mid) <= days:
                hi = mid
            else:
                lo = mid + 1
        return lo
`.trim();

const SOL_BS_KTH_MISSING = `
# Missing count before arr[mid] = arr[mid] - (mid + 1)
class Solution:
    def findKthPositive(self, arr, k):
        lo, hi = 0, len(arr)
        while lo < hi:
            mid = (lo + hi) // 2
            missing = arr[mid] - (mid + 1)
            if missing < k:
                lo = mid + 1
            else:
                hi = mid
        return lo + k
`.trim();

const SOL_BS_COWS = `
# Binary-search the minimum gap; greedily place cows that far apart
def aggressive_cows(stalls, cows):
    stalls.sort()
    def can_place(dist):
        count, last = 1, stalls[0]
        for s in stalls[1:]:
            if s - last >= dist:
                count += 1
                last = s
        return count >= cows
    lo, hi, ans = 1, stalls[-1] - stalls[0], 0
    while lo <= hi:
        mid = (lo + hi) // 2
        if can_place(mid):
            ans = mid          # works -> try a bigger gap
            lo = mid + 1
        else:
            hi = mid - 1
    return ans
`.trim();

// ─── Binary Search: harder answers + 2D matrices ──────────────────────────────
const SOL_BS_BOOK = `
# Minimize the max pages a student reads -> BS on the page limit
def book_allocation(books, students):
    if students > len(books):
        return -1
    def can(limit):
        count, cur = 1, 0
        for pages in books:
            if cur + pages > limit:
                count += 1
                cur = 0
            cur += pages
        return count <= students
    lo, hi = max(books), sum(books)
    while lo < hi:
        mid = (lo + hi) // 2
        if can(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo
`.trim();

const SOL_BS_SPLIT = `
# Same idea: minimize the largest subarray sum across k splits
class Solution:
    def splitArray(self, nums, k):
        def needed(limit):
            count, cur = 1, 0
            for x in nums:
                if cur + x > limit:
                    count += 1
                    cur = 0
                cur += x
            return count
        lo, hi = max(nums), sum(nums)
        while lo < hi:
            mid = (lo + hi) // 2
            if needed(mid) <= k:
                hi = mid
            else:
                lo = mid + 1
        return lo
`.trim();

const SOL_BS_PAINTER = `
# Identical to book allocation — minimize the max time per painter
def painters_partition(boards, painters):
    def can(time):
        count, cur = 1, 0
        for b in boards:
            if cur + b > time:
                count += 1
                cur = 0
            cur += b
        return count <= painters
    lo, hi = max(boards), sum(boards)
    while lo < hi:
        mid = (lo + hi) // 2
        if can(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo
`.trim();

const SOL_BS_GAS = `
# Binary-search a REAL-valued max gap; count stations needed for it
class Solution:
    def minmaxGasDist(self, stations, k):
        def count(dist):
            need = 0
            for i in range(1, len(stations)):
                gap = stations[i] - stations[i - 1]
                need += int(gap / dist)
            return need
        lo, hi = 0.0, float(stations[-1] - stations[0])
        while hi - lo > 1e-6:
            mid = (lo + hi) / 2
            if count(mid) <= k:
                hi = mid
            else:
                lo = mid
        return hi
`.trim();

const SOL_BS_MEDIAN2 = `
# Partition both arrays so left half == right half -> O(log(min(m,n)))
class Solution:
    def findMedianSortedArrays(self, a, b):
        if len(a) > len(b):
            a, b = b, a
        m, n = len(a), len(b)
        lo, hi = 0, m
        while lo <= hi:
            i = (lo + hi) // 2
            j = (m + n + 1) // 2 - i
            a_left  = a[i - 1] if i > 0 else float("-inf")
            a_right = a[i]     if i < m else float("inf")
            b_left  = b[j - 1] if j > 0 else float("-inf")
            b_right = b[j]     if j < n else float("inf")
            if a_left <= b_right and b_left <= a_right:
                if (m + n) % 2:
                    return max(a_left, b_left)
                return (max(a_left, b_left) + min(a_right, b_right)) / 2
            elif a_left > b_right:
                hi = i - 1
            else:
                lo = i + 1
        return 0.0
`.trim();

const SOL_BS_KTH2 = `
# Merge-walk to the k-th smallest (O(k)); a partition BS gives O(log min)
def kth_element(a, b, k):
    i = j = 0
    val = -1
    for _ in range(k):
        if i < len(a) and (j >= len(b) or a[i] <= b[j]):
            val = a[i]; i += 1
        else:
            val = b[j]; j += 1
    return val
`.trim();

const SOL_BS_ROW_MAX1 = `
# Count 1's per row, keep the row with the most
class Solution:
    def rowAndMaximumOnes(self, mat):
        best_row, best_count = 0, -1
        for i, row in enumerate(mat):
            ones = sum(row)
            if ones > best_count:
                best_count = ones
                best_row = i
        return [best_row, best_count]
`.trim();

const SOL_BS_2D = `
# Fully sorted matrix -> treat it as one sorted array of size rows*cols
class Solution:
    def searchMatrix(self, matrix, target):
        rows, cols = len(matrix), len(matrix[0])
        lo, hi = 0, rows * cols - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            val = matrix[mid // cols][mid % cols]
            if val == target:
                return True
            elif val < target:
                lo = mid + 1
            else:
                hi = mid - 1
        return False
`.trim();

const SOL_BS_2D2 = `
# Rows & cols sorted -> staircase from the top-right corner
class Solution:
    def searchMatrix(self, matrix, target):
        r, c = 0, len(matrix[0]) - 1
        while r < len(matrix) and c >= 0:
            if matrix[r][c] == target:
                return True
            elif matrix[r][c] > target:
                c -= 1          # too big -> go left
            else:
                r += 1          # too small -> go down
        return False
`.trim();

const SOL_BS_PEAK2 = `
# Binary-search columns; compare the column's max with its neighbours
class Solution:
    def findPeakGrid(self, mat):
        lo, hi = 0, len(mat[0]) - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            best_row = max(range(len(mat)), key=lambda r: mat[r][mid])
            left  = mat[best_row][mid - 1] if mid > 0 else -1
            right = mat[best_row][mid + 1] if mid < len(mat[0]) - 1 else -1
            if mat[best_row][mid] > left and mat[best_row][mid] > right:
                return [best_row, mid]
            elif left > mat[best_row][mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        return [-1, -1]
`.trim();

const SOL_BS_MATRIX_MEDIAN = `
# BS on the value; count how many entries are <= mid using row binary search
import bisect
def matrix_median(matrix):
    n, m = len(matrix), len(matrix[0])
    lo = min(row[0] for row in matrix)
    hi = max(row[-1] for row in matrix)
    target = (n * m) // 2
    while lo < hi:
        mid = (lo + hi) // 2
        count = sum(bisect.bisect_right(row, mid) for row in matrix)
        if count <= target:
            lo = mid + 1
        else:
            hi = mid
    return lo
`.trim();

// ─── String solutions ─────────────────────────────────────────────────────────
const SOL_STR_REMOVE_OUTER = `
# Track depth; keep a paren only when it's NOT the outermost of its group
class Solution:
    def removeOuterParentheses(self, s: str) -> str:
        res, depth = [], 0
        for ch in s:
            if ch == "(":
                if depth > 0:
                    res.append(ch)
                depth += 1
            else:
                depth -= 1
                if depth > 0:
                    res.append(ch)
        return "".join(res)
`.trim();

const SOL_STR_REVERSE_WORDS = `
# split() drops extra spaces; reverse the word list
class Solution:
    def reverseWords(self, s: str) -> str:
        return " ".join(s.split()[::-1])
`.trim();

const SOL_STR_LARGEST_ODD = `
# Largest odd number = longest prefix ending in an odd digit
class Solution:
    def largestOddNumber(self, num: str) -> str:
        for i in range(len(num) - 1, -1, -1):
            if int(num[i]) % 2 == 1:
                return num[:i + 1]
        return ""
`.trim();

const SOL_STR_LCP = `
# Shrink the prefix until it matches the start of every string
class Solution:
    def longestCommonPrefix(self, strs):
        if not strs:
            return ""
        prefix = strs[0]
        for s in strs[1:]:
            while not s.startswith(prefix):
                prefix = prefix[:-1]
                if not prefix:
                    return ""
        return prefix
`.trim();

const SOL_STR_ISOMORPHIC = `
# A consistent one-to-one mapping must hold in BOTH directions
class Solution:
    def isIsomorphic(self, s: str, t: str) -> bool:
        map_st, map_ts = {}, {}
        for a, b in zip(s, t):
            if a in map_st and map_st[a] != b:
                return False
            if b in map_ts and map_ts[b] != a:
                return False
            map_st[a] = b
            map_ts[b] = a
        return True
`.trim();

const SOL_STR_ROTATE = `
# goal is a rotation of s iff it appears inside s + s
class Solution:
    def rotateString(self, s: str, goal: str) -> bool:
        return len(s) == len(goal) and goal in (s + s)
`.trim();

const SOL_STR_ANAGRAM = `
# Anagrams have identical character counts
from collections import Counter
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        return Counter(s) == Counter(t)
`.trim();

const SOL_STR_SORT_FREQ = `
# Most-common-first, repeating each char by its count
from collections import Counter
class Solution:
    def frequencySort(self, s: str) -> str:
        freq = Counter(s)
        return "".join(ch * c for ch, c in freq.most_common())
`.trim();

const SOL_STR_MAX_DEPTH = `
# Depth rises on '(' and falls on ')'; track the maximum
class Solution:
    def maxDepth(self, s: str) -> int:
        depth = best = 0
        for ch in s:
            if ch == "(":
                depth += 1
                best = max(best, depth)
            elif ch == ")":
                depth -= 1
        return best
`.trim();

const SOL_STR_ROMAN = `
# If a smaller numeral sits before a bigger one, subtract it
class Solution:
    def romanToInt(self, s: str) -> int:
        vals = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000}
        total = 0
        for i in range(len(s)):
            if i + 1 < len(s) and vals[s[i]] < vals[s[i + 1]]:
                total -= vals[s[i]]
            else:
                total += vals[s[i]]
        return total
`.trim();

const SOL_STR_ATOI = `
# Trim, read an optional sign, consume digits, clamp to 32-bit
class Solution:
    def myAtoi(self, s: str) -> int:
        s = s.strip()
        if not s:
            return 0
        i, sign, num = 0, 1, 0
        if s[0] in "+-":
            sign = -1 if s[0] == "-" else 1
            i = 1
        while i < len(s) and s[i].isdigit():
            num = num * 10 + int(s[i])
            i += 1
        num *= sign
        return max(-2**31, min(2**31 - 1, num))
`.trim();

const SOL_STR_COUNT_SUBSTR = `
# Substrings with EXACTLY k distinct = atMost(k) - atMost(k-1)
from collections import defaultdict
def count_substr_k_distinct(s, k):
    def at_most(k):
        count = defaultdict(int)
        left = res = 0
        for right in range(len(s)):
            count[s[right]] += 1
            while len(count) > k:
                count[s[left]] -= 1
                if count[s[left]] == 0:
                    del count[s[left]]
                left += 1
            res += right - left + 1
        return res
    return at_most(k) - at_most(k - 1)
`.trim();

const SOL_STR_LPS = `
# Expand around every center (odd & even) and keep the longest palindrome
class Solution:
    def longestPalindrome(self, s: str) -> str:
        if not s:
            return ""
        start = end = 0
        def expand(l, r):
            while l >= 0 and r < len(s) and s[l] == s[r]:
                l -= 1
                r += 1
            return l + 1, r - 1
        for i in range(len(s)):
            l1, r1 = expand(i, i)
            l2, r2 = expand(i, i + 1)
            if r1 - l1 > end - start:
                start, end = l1, r1
            if r2 - l2 > end - start:
                start, end = l2, r2
        return s[start:end + 1]
`.trim();

const SOL_STR_BEAUTY = `
# Beauty = (max freq - min freq). Sum it over all substrings.
from collections import Counter
class Solution:
    def beautySum(self, s: str) -> int:
        total = 0
        for i in range(len(s)):
            freq = Counter()
            for j in range(i, len(s)):
                freq[s[j]] += 1
                total += max(freq.values()) - min(freq.values())
        return total
`.trim();

const SOL_STR_REVERSE_WORDS2 = `
class Solution:
    def reverseWords(self, s: str) -> str:
        return " ".join(reversed(s.split()))
`.trim();

// ─── Sheet data ───────────────────────────────────────────────────────────────
const SHEET: SheetSection[] = [
  {
    id: "basics",
    title: "Learn the Basics",
    subSections: [
      {
        id: "basics-know",
        title: "Things to Know in Python",
        problems: [
          { id: "b-io",        title: "Input / Output",                         difficulty: "Easy", youtubeUrl: "https://www.youtube.com/watch?v=kvKvYXXuHoo", solveUrl: "https://www.geeksforgeeks.org/python/input-and-output-in-python/", solution: SOL_B_IO },
          { id: "b-ifelse",    title: "If / Else If",                           difficulty: "Easy", youtubeUrl: "https://www.youtube.com/watch?v=FvMPfrgGeKs", solveUrl: "https://www.hackerrank.com/challenges/py-if-else/problem", solution: SOL_B_IFELSE },
          { id: "b-switch",    title: "Switch Case",                            difficulty: "Easy", youtubeUrl: "https://www.youtube.com/watch?v=UNnz4THVhy0", solveUrl: "https://www.hackerrank.com/challenges/py-if-else/problem", solution: SOL_B_SWITCH },
          { id: "b-for",       title: "For Loops",                              difficulty: "Easy", youtubeUrl: "https://www.youtube.com/watch?v=94UHCEmprCY", solveUrl: "https://www.hackerrank.com/challenges/python-loops/problem", solution: SOL_B_FOR },
          { id: "b-while",     title: "While Loops",                            difficulty: "Easy", youtubeUrl: "https://www.youtube.com/watch?v=6iF8Xb7Z3wQ", solveUrl: "https://www.hackerrank.com/challenges/python-loops/problem", solution: SOL_B_WHILE },
          { id: "b-functions", title: "Functions (Pass by Reference and Value)", difficulty: "Easy", youtubeUrl: "https://www.youtube.com/watch?v=9Os0o3wzS_I", solveUrl: "https://www.hackerrank.com/challenges/write-a-function/problem", solution: SOL_B_FUNCTIONS },
          { id: "b-collections", title: "Python Collections (Theory)", difficulty: "Easy", solution: SOL_B_COLLECTIONS },
        ],
      },
      {
        id: "basics-patterns",
        title: "Build-up Logical Thinking",
        problems: [
          { id: "b-patterns", title: "Patterns", difficulty: "Easy", youtubeUrl: "https://youtu.be/rUy_Nq9DHTs", solveUrl: "https://www.geeksforgeeks.org/dsa/pattern-printing-problems/", solution: SOL_B_PATTERNS },
        ],
      },
      {
        id: "basics-maths",
        title: "Know Basic Maths",
        problems: [
          { id: "m-count-digits",   title: "Count All Digits of a Number",      difficulty: "Easy", youtubeUrl: "https://youtu.be/STcQTjhIKkc", solveUrl: "https://www.geeksforgeeks.org/problems/count-total-digits-in-a-number/1", solution: SOL_M_COUNT_DIGITS },
          { id: "m-reverse-num",    title: "Reverse a Number",                  difficulty: "Easy", youtubeUrl: "https://youtu.be/aAuWRPO7KYU", solveUrl: "https://www.geeksforgeeks.org/problems/reverse-digit0316/1", solution: SOL_M_REVERSE_NUM },
          { id: "m-palindrome-num", title: "Palindrome Number",                 difficulty: "Easy", youtubeUrl: "https://youtu.be/uUIucXNMEKc", solveUrl: "https://leetcode.com/problems/palindrome-number/", solution: SOL_M_PALINDROME_NUM },
          { id: "m-gcd",            title: "GCD of Two Numbers",                difficulty: "Easy", youtubeUrl: "https://youtu.be/cahuG1cEQdY", solveUrl: "https://www.geeksforgeeks.org/problems/gcd-of-two-numbers3459/1", solution: SOL_M_GCD },
          { id: "m-armstrong",      title: "Check if the Number is Armstrong",  difficulty: "Easy", youtubeUrl: "https://youtu.be/32nhYSaSvfs", solveUrl: "https://www.geeksforgeeks.org/problems/armstrong-numbers2727/1", solution: SOL_M_ARMSTRONG },
          { id: "m-divisors",       title: "Print All Divisors",                difficulty: "Easy", youtubeUrl: "https://youtu.be/Ae_Ag_saG9s", solveUrl: "https://www.geeksforgeeks.org/problems/all-divisors-of-a-number/1", solution: SOL_M_DIVISORS },
          { id: "m-prime",          title: "Check for Prime Number",            difficulty: "Easy", youtubeUrl: "https://youtu.be/SpTAxH_Geow", solveUrl: "https://www.geeksforgeeks.org/problems/prime-number2314/1", solution: SOL_M_PRIME },
        ],
      },
      {
        id: "basics-recursion",
        title: "Learn Basic Recursion",
        problems: [
          { id: "r-print-n",   title: "Understand Recursion — Print Something N Times", difficulty: "Easy", youtubeUrl: "https://youtu.be/XkL3SUioNvo", solveUrl: "https://www.geeksforgeeks.org/problems/print-gfg-n-times/1", solution: SOL_R_PRINT_N },
          { id: "r-print-name", title: "Print Name N Times using Recursion",            difficulty: "Easy", youtubeUrl: "https://www.youtube.com/watch?v=un6PLygfXrA", solveUrl: "https://takeuforward.org/recursion/print-name-n-times-using-recursion", solution: SOL_R_PRINT_NAME },
          { id: "r-1-to-n",    title: "Print 1 to N using Recursion",                   difficulty: "Easy", youtubeUrl: "https://youtu.be/biHp1aRV0uI", solveUrl: "https://www.geeksforgeeks.org/dsa/print-1-to-n-without-using-loops/", solution: SOL_R_1_TO_N },
          { id: "r-n-to-1",    title: "Print N to 1 using Recursion",                   difficulty: "Easy", youtubeUrl: "https://www.youtube.com/watch?v=un6PLygfXrA", solveUrl: "https://www.geeksforgeeks.org/dsa/print-n-to-1-without-loop/", solution: SOL_R_N_TO_1 },
          { id: "r-sum-n",     title: "Sum of First N Numbers",                         difficulty: "Easy", youtubeUrl: "https://youtu.be/uzmt9f8TEP8", solveUrl: "https://www.geeksforgeeks.org/dsa/program-find-sum-first-n-natural-numbers/", solution: SOL_R_SUM_N },
          { id: "r-factorial", title: "Factorial of a Given Number",                    difficulty: "Easy", youtubeUrl: "https://youtu.be/LLWVw6cUe8s", solveUrl: "https://www.geeksforgeeks.org/problems/factorial5739/1", solution: SOL_R_FACTORIAL },
          { id: "r-fibonacci", title: "Fibonacci Number",                                difficulty: "Easy", youtubeUrl: "https://youtu.be/7Sv4NmvdHcw", solveUrl: "https://leetcode.com/problems/fibonacci-number/description/", solution: SOL_R_FIB },
        ],
      },
      {
        id: "basics-hashing",
        title: "Learn Basic Hashing",
        problems: [
          { id: "h-basic",       title: "Basic Hashing",                       difficulty: "Easy", youtubeUrl: "https://youtu.be/0IE5T63qEHg", solveUrl: "https://www.geeksforgeeks.org/dsa/hashing-data-structure/", solution: SOL_H_BASIC },
          { id: "h-count-freq",  title: "Counting Frequencies of Array Elements", difficulty: "Easy", youtubeUrl: "https://youtu.be/Ocd_uHpsQyg", solveUrl: "https://leetcode.com/problems/count-elements-with-maximum-frequency/", solution: SOL_H_COUNT_FREQ },
          { id: "h-highest",     title: "Highest Occurring Element in an Array", difficulty: "Easy", youtubeUrl: "https://youtu.be/sdPGGAw9VKE", solveUrl: "https://leetcode.com/problems/frequency-of-the-most-frequent-element/", solution: SOL_H_HIGHEST },
        ],
      },
    ],
  },
  {
    id: "arrays",
    title: "Arrays",
    subSections: [
      {
        id: "arr-basics",
        title: "Arrays Basics",
        problems: [
          { id: "as-reverse-arr", title: "Reverse an Array", difficulty: "Easy", youtubeUrl: "https://youtu.be/RynoW0e9I7U", solveUrl: "https://www.geeksforgeeks.org/problems/reverse-an-array/1", solution: SOL_AS_REVERSE_ARR },
        ],
      },
      {
        id: "arr-easy",
        title: "Easy Problems",
        problems: [
          { id: "arr-largest",     title: "Largest Element",              difficulty: "Easy",   youtubeUrl: "https://youtu.be/H52p90uVUGA", solveUrl: "https://www.geeksforgeeks.org/problems/largest-element-in-array4009/1", solution: SOL_ARR_LARGEST },
          { id: "arr-second",      title: "Second Largest Element",       difficulty: "Easy",   youtubeUrl: "https://youtu.be/Z6TwNJJ9OoQ", solveUrl: "https://www.geeksforgeeks.org/dsa/find-second-largest-element-array/", solution: SOL_ARR_SECOND },
          { id: "arr-sorted",      title: "Check if the Array is Sorted", difficulty: "Easy",   youtubeUrl: "https://youtu.be/Vzs_vlCIFEw", solveUrl: "https://www.geeksforgeeks.org/problems/check-if-an-array-is-sorted0701/1", solution: SOL_ARR_SORTED },
          { id: "arr-remove-dup",  title: "Remove Duplicates from Sorted Array", difficulty: "Easy", youtubeUrl: "https://youtu.be/oMr9lehS7Us", solveUrl: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/", solution: SOL_ARR_REMOVE_DUP },
          { id: "arr-rotate-1",    title: "Left Rotate Array by One",     difficulty: "Easy",   youtubeUrl: "https://youtu.be/_EHlC6xhhE0", solveUrl: "https://www.geeksforgeeks.org/problems/cyclically-rotate-an-array-by-one2614/1", solution: SOL_ARR_ROTATE1 },
          { id: "arr-rotate-k",    title: "Left Rotate Array by K Places", difficulty: "Medium", youtubeUrl: "https://youtu.be/HRzQK5TkrZM", solveUrl: "https://leetcode.com/problems/rotate-array/", solution: SOL_ARR_ROTATEK },
          { id: "arr-move-zero",   title: "Move Zeroes to End",           difficulty: "Easy",   youtubeUrl: "https://youtu.be/aayNRwUN3Do", solveUrl: "https://leetcode.com/problems/move-zeroes/", solution: SOL_ARR_MOVE_ZERO },
          { id: "arr-linear",      title: "Linear Search",                difficulty: "Easy",   youtubeUrl: "https://youtu.be/ap8YSOIXWME", solveUrl: "https://www.geeksforgeeks.org/dsa/linear-search/", solution: SOL_ARR_LINEAR },
          { id: "arr-union",       title: "Union of Two Sorted Arrays",   difficulty: "Easy",   youtubeUrl: "https://youtu.be/PK-66s-t95M", solveUrl: "https://www.geeksforgeeks.org/problems/union-of-two-sorted-arrays-1587115621/1", solution: SOL_ARR_UNION },
          { id: "arr-missing",     title: "Find Missing Number",          difficulty: "Easy",   youtubeUrl: "https://youtu.be/WnPLSRLSANE", solveUrl: "https://leetcode.com/problems/missing-number/", solution: SOL_ARR_MISSING },
        ],
      },
      {
        id: "arr-medium",
        title: "Medium Problems",
        problems: [
          { id: "arr-two-sum",      title: "Two Sum",                                difficulty: "Easy",   youtubeUrl: "https://youtu.be/KLlXCFG5TnA", solveUrl: "https://leetcode.com/problems/two-sum/", solution: SOL_ARR_TWOSUM },
          { id: "arr-sort012",      title: "Sort an Array of 0's, 1's and 2's",      difficulty: "Medium", youtubeUrl: "https://youtu.be/CQwvhMQeip8", solveUrl: "https://www.geeksforgeeks.org/problems/sort-an-array-of-0s-1s-and-2s4231/1", solution: SOL_ARR_SORT012 },
          { id: "arr-majority",     title: "Majority Element (> n/2)",               difficulty: "Easy",   youtubeUrl: "https://youtu.be/7pnhv842keE", solveUrl: "https://leetcode.com/problems/majority-element/", solution: SOL_ARR_MAJORITY },
          { id: "arr-kadane",       title: "Kadane's Algorithm (Max Subarray Sum)",  difficulty: "Medium", youtubeUrl: "https://youtu.be/NUWAXbSlsws", solveUrl: "https://leetcode.com/problems/maximum-subarray/description/", solution: SOL_ARR_KADANE },
          { id: "arr-print-maxsub", title: "Print Subarray with Maximum Sum",        difficulty: "Medium", youtubeUrl: "https://youtu.be/CH4cZxbySuk", solveUrl: "https://www.geeksforgeeks.org/problems/maximum-sub-array5443/1", solution: SOL_ARR_PRINT_MAXSUB },
          { id: "arr-stock",        title: "Stock Buy and Sell",                     difficulty: "Easy",   youtubeUrl: "https://youtu.be/excAOvwF_Wk", solveUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", solution: SOL_ARR_STOCK },
          { id: "arr-rearrange",    title: "Rearrange Array Elements by Sign",       difficulty: "Medium", youtubeUrl: "https://youtu.be/SoPmcGzz9-E", solveUrl: "https://leetcode.com/problems/rearrange-array-elements-by-sign/", solution: SOL_ARR_REARRANGE },
          { id: "arr-next-perm",    title: "Next Permutation",                       difficulty: "Medium", youtubeUrl: "https://youtu.be/IhsUbEMfIbY", solveUrl: "https://leetcode.com/problems/next-permutation/", solution: SOL_ARR_NEXTPERM },
          { id: "arr-leaders",      title: "Leaders in an Array",                    difficulty: "Easy",   youtubeUrl: "https://youtu.be/cHrH9CQ8pmY", solveUrl: "https://www.geeksforgeeks.org/dsa/leaders-in-an-array/", solution: SOL_ARR_LEADERS },
        ],
      },
      {
        id: "arr-hard",
        title: "Hard Problems",
        problems: [
          { id: "arr-lcs-seq",     title: "Longest Consecutive Sequence",  difficulty: "Medium", youtubeUrl: "https://youtu.be/P6RZZMu_maU", solveUrl: "https://leetcode.com/problems/longest-consecutive-sequence/", solution: SOL_ARR_LCS_SEQ },
          { id: "arr-set-zeroes",  title: "Set Matrix Zeroes",             difficulty: "Medium", youtubeUrl: "https://youtu.be/N0MgLvceX7M", solveUrl: "https://leetcode.com/problems/set-matrix-zeroes/", solution: SOL_ARR_SET_ZEROES },
          { id: "arr-rotate-img",  title: "Rotate Matrix by 90 Degrees",   difficulty: "Medium", youtubeUrl: "https://youtu.be/Z0R2u6gd3GU", solveUrl: "https://leetcode.com/problems/rotate-image/", solution: SOL_ARR_ROTATE_IMG },
          { id: "arr-spiral",      title: "Print the Matrix in Spiral Manner", difficulty: "Medium", youtubeUrl: "https://youtu.be/3Zv-s9UUrFM", solveUrl: "https://leetcode.com/problems/spiral-matrix/", solution: SOL_ARR_SPIRAL },
          { id: "arr-count-sub",   title: "Count Subarrays with Given Sum", difficulty: "Medium", youtubeUrl: "https://youtu.be/HsA2gWVIOx0", solveUrl: "https://www.geeksforgeeks.org/dsa/number-subarrays-sum-exactly-equal-k/", solution: SOL_ARR_COUNT_SUB },
          { id: "arr-pascal",      title: "Pascal's Triangle",             difficulty: "Easy",   youtubeUrl: "https://youtu.be/NWpkLmpU5qw", solveUrl: "https://leetcode.com/problems/pascals-triangle/", solution: SOL_ARR_PASCAL },
          { id: "arr-majority2",   title: "Majority Element II (> n/3)",   difficulty: "Medium", youtubeUrl: "https://youtu.be/Y0CfzNQxWKo", solveUrl: "https://leetcode.com/problems/majority-element-ii/description/", solution: SOL_ARR_MAJORITY2 },
          { id: "arr-3sum",        title: "3 Sum",                         difficulty: "Medium", youtubeUrl: "https://youtu.be/jzZsG8n2R9A", solveUrl: "https://leetcode.com/problems/3sum/description/", solution: SOL_ARR_3SUM },
          { id: "arr-4sum",        title: "4 Sum",                         difficulty: "Hard",   youtubeUrl: "https://youtu.be/EYeR-_1NRlQ", solveUrl: "https://leetcode.com/problems/4sum/description/", solution: SOL_ARR_4SUM },
          { id: "arr-subsum0",       title: "Largest Subarray with Sum 0",         difficulty: "Medium", youtubeUrl: "https://youtu.be/xmguZ6GbatA", solveUrl: "https://www.geeksforgeeks.org/problems/largest-subarray-with-0-sum/1", solution: SOL_ARR_SUBSUM0 },
          { id: "arr-xork",          title: "Count Subarrays with Given XOR K",    difficulty: "Hard",   youtubeUrl: "https://youtu.be/eZr-6p0B7ME", solveUrl: "https://www.geeksforgeeks.org/problems/count-subarray-with-given-xor/1", solution: SOL_ARR_XORK },
          { id: "arr-merge-int",     title: "Merge Overlapping Subintervals",      difficulty: "Medium", youtubeUrl: "https://youtu.be/IexN60k62jo", solveUrl: "https://leetcode.com/problems/merge-intervals/", solution: SOL_ARR_MERGE_INT },
          { id: "arr-merge-sorted",  title: "Merge Two Sorted Arrays without Extra Space", difficulty: "Hard", youtubeUrl: "https://youtu.be/n7uwj04E0I4", solveUrl: "https://leetcode.com/problems/merge-sorted-array/", solution: SOL_ARR_MERGE_SORTED },
          { id: "arr-repeat-missing", title: "Find the Repeating and Missing Number", difficulty: "Hard", youtubeUrl: "https://youtu.be/2D0D8HE6uak", solveUrl: "https://leetcode.com/problems/find-missing-and-repeated-values/description/", solution: SOL_ARR_REPEAT_MISSING },
          { id: "arr-inversions",    title: "Count Inversions",                    difficulty: "Hard",   youtubeUrl: "https://youtu.be/ITiHU2PqHZQ", solveUrl: "https://www.geeksforgeeks.org/problems/inversion-of-array-1587115620/1", solution: SOL_ARR_INVERSIONS },
          { id: "arr-reverse-pairs", title: "Reverse Pairs",                       difficulty: "Hard",   youtubeUrl: "https://youtu.be/0e4bZaP3MDI", solveUrl: "https://leetcode.com/problems/reverse-pairs/description/", solution: SOL_ARR_REVERSE_PAIRS },
          { id: "arr-max-product",   title: "Maximum Product Subarray",            difficulty: "Medium", youtubeUrl: "https://youtu.be/5X5GEFKRgnM", solveUrl: "https://leetcode.com/problems/maximum-product-subarray/", solution: SOL_ARR_MAX_PRODUCT },
        ],
      },
    ],
  },
  {
    id: "binary-search",
    title: "Binary Search",
    subSections: [
      {
        id: "bs-1d",
        title: "BS on 1D Arrays",
        problems: [
          { id: "bs-search",      title: "Search X in Sorted Array",       difficulty: "Easy",   youtubeUrl: "https://youtu.be/U8XENwh8Oy8", solveUrl: "https://leetcode.com/problems/binary-search/", solution: SOL_BS_SEARCH },
          { id: "bs-lower",       title: "Lower Bound",                    difficulty: "Easy",   youtubeUrl: "https://youtu.be/6zhGS79oQ4k", solveUrl: "https://www.geeksforgeeks.org/problems/implement-lower-bound/1", solution: SOL_BS_LOWER },
          { id: "bs-upper",       title: "Upper Bound",                    difficulty: "Easy",   youtubeUrl: "https://youtu.be/6zhGS79oQ4k", solveUrl: "https://www.geeksforgeeks.org/problems/implement-upper-bound/1", solution: SOL_BS_UPPER },
          { id: "bs-insert",      title: "Search Insert Position",         difficulty: "Easy",   youtubeUrl: "https://youtu.be/K-RYzDZkzCI", solveUrl: "https://leetcode.com/problems/search-insert-position/", solution: SOL_BS_INSERT },
          { id: "bs-floor-ceil",  title: "Floor and Ceil in Sorted Array", difficulty: "Easy",   youtubeUrl: "https://youtu.be/W1ombWDEPJg", solveUrl: "https://www.geeksforgeeks.org/problems/floor-in-a-sorted-array-1587115620/1", solution: SOL_BS_FLOOR_CEIL },
          { id: "bs-first-last",  title: "First and Last Occurrence",      difficulty: "Medium", youtubeUrl: "https://youtu.be/hjR1IYVx9lY", solveUrl: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/", solution: SOL_BS_FIRST_LAST },
          { id: "bs-count",       title: "Count Occurrences in a Sorted Array", difficulty: "Easy", youtubeUrl: "https://youtu.be/hjR1IYVx9lY", solveUrl: "https://www.geeksforgeeks.org/problems/number-of-occurrence2259/1", solution: SOL_BS_COUNT },
        ],
      },
      {
        id: "bs-rotated",
        title: "BS on Rotated / Modified Arrays",
        problems: [
          { id: "bs-rotated1",  title: "Search in Rotated Sorted Array I",  difficulty: "Medium", youtubeUrl: "https://youtu.be/U8XENwh8Oy8", solveUrl: "https://leetcode.com/problems/search-in-rotated-sorted-array/description/", solution: SOL_BS_ROTATED1 },
          { id: "bs-rotated2",  title: "Search in Rotated Sorted Array II", difficulty: "Medium", youtubeUrl: "https://youtu.be/oUnF7o88_Xc", solveUrl: "https://leetcode.com/problems/search-in-rotated-sorted-array-ii/", solution: SOL_BS_ROTATED2 },
          { id: "bs-find-min",  title: "Find Minimum in Rotated Sorted Array", difficulty: "Medium", youtubeUrl: "https://youtu.be/nIVW4P8b1VA", solveUrl: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/description/", solution: SOL_BS_FIND_MIN },
          { id: "bs-count-rot", title: "Find How Many Times Array is Rotated", difficulty: "Easy", youtubeUrl: "https://youtu.be/jtSiWTPLwd0", solveUrl: "https://www.geeksforgeeks.org/problems/rotation4723/1", solution: SOL_BS_COUNT_ROT },
          { id: "bs-single",    title: "Single Element in a Sorted Array",  difficulty: "Medium", youtubeUrl: "https://youtu.be/HGtqdzyUJ3k", solveUrl: "https://leetcode.com/problems/single-element-in-a-sorted-array/description/", solution: SOL_BS_SINGLE },
          { id: "bs-peak",      title: "Find Peak Element",                 difficulty: "Medium", youtubeUrl: "https://youtu.be/kMzJy9es7Hc", solveUrl: "https://leetcode.com/problems/find-peak-element/description/", solution: SOL_BS_PEAK },
        ],
      },
      {
        id: "bs-answers",
        title: "BS on Answers",
        problems: [
          { id: "bs-sqrt",         title: "Find Square Root of a Number",            difficulty: "Easy",   youtubeUrl: "https://youtu.be/cXxmbemS6XM", solveUrl: "https://www.geeksforgeeks.org/problems/square-root/1", solution: SOL_BS_SQRT },
          { id: "bs-nth-root",     title: "Find Nth Root of a Number",               difficulty: "Easy",   youtubeUrl: "https://youtu.be/rjEJeYCasHs", solveUrl: "https://www.geeksforgeeks.org/problems/find-nth-root-of-m5843/1", solution: SOL_BS_NTH_ROOT },
          { id: "bs-koko",         title: "Koko Eating Bananas",                     difficulty: "Medium", youtubeUrl: "https://youtu.be/U2SozAs9RzA", solveUrl: "https://leetcode.com/problems/koko-eating-bananas/description/", solution: SOL_BS_KOKO },
          { id: "bs-bouquets",     title: "Minimum Days to Make M Bouquets",         difficulty: "Medium", youtubeUrl: "https://youtu.be/TXAuxeYBTdg", solveUrl: "https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/description/", solution: SOL_BS_BOUQUETS },
          { id: "bs-divisor",      title: "Find the Smallest Divisor",               difficulty: "Medium", youtubeUrl: "https://youtu.be/UvBKTVaG6U8", solveUrl: "https://leetcode.com/problems/find-the-smallest-divisor-given-a-threshold/description/", solution: SOL_BS_DIVISOR },
          { id: "bs-ship",         title: "Capacity to Ship Packages Within D Days", difficulty: "Medium", youtubeUrl: "https://youtu.be/MG-Ac4TAvTY", solveUrl: "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/description/", solution: SOL_BS_SHIP },
          { id: "bs-kth-missing",  title: "Kth Missing Positive Number",             difficulty: "Easy",   youtubeUrl: "https://youtu.be/NObPmjZIh8Y", solveUrl: "https://leetcode.com/problems/kth-missing-positive-number/description/", solution: SOL_BS_KTH_MISSING },
          { id: "bs-cows",         title: "Aggressive Cows",                         difficulty: "Hard",   youtubeUrl: "https://youtu.be/R_Mfw4ew-Vo", solveUrl: "https://www.geeksforgeeks.org/problems/aggressive-cows/1", solution: SOL_BS_COWS },
          { id: "bs-book",         title: "Book Allocation Problem",                 difficulty: "Hard",   youtubeUrl: "https://youtu.be/VyvRCmQ3sqU", solveUrl: "https://www.geeksforgeeks.org/problems/allocate-minimum-number-of-pages0937/1", solution: SOL_BS_BOOK },
          { id: "bs-split",        title: "Split Array - Largest Sum",               difficulty: "Hard",   youtubeUrl: "https://youtu.be/YUF3_eBdzsk", solveUrl: "https://leetcode.com/problems/split-array-largest-sum/", solution: SOL_BS_SPLIT },
          { id: "bs-painter",      title: "Painter's Partition",                     difficulty: "Hard",   youtubeUrl: "https://youtu.be/srsFN5OHBgw", solveUrl: "https://www.geeksforgeeks.org/dsa/painters-partition-problem/", solution: SOL_BS_PAINTER },
          { id: "bs-gas",          title: "Minimize Max Distance to Gas Station",    difficulty: "Hard",   youtubeUrl: "https://youtu.be/kMSBvlZ-_HA", solveUrl: "https://leetcode.com/problems/minimize-max-distance-to-gas-station/description/", solution: SOL_BS_GAS },
          { id: "bs-median2",      title: "Median of 2 Sorted Arrays",               difficulty: "Hard",   youtubeUrl: "https://youtu.be/q6IEA26hvXc", solveUrl: "https://leetcode.com/problems/median-of-two-sorted-arrays/", solution: SOL_BS_MEDIAN2 },
          { id: "bs-kth2",         title: "Kth Element of 2 Sorted Arrays",          difficulty: "Medium", youtubeUrl: "https://youtu.be/D1oDwWCq50g", solveUrl: "https://www.geeksforgeeks.org/problems/k-th-element-of-two-sorted-array1317/1", solution: SOL_BS_KTH2 },
        ],
      },
      {
        id: "bs-2d",
        title: "BS on 2D Matrices",
        problems: [
          { id: "bs-row-max1",  title: "Find Row with Maximum 1's",  difficulty: "Easy",   youtubeUrl: "https://youtu.be/SCz-1TtYxDI", solveUrl: "https://leetcode.com/problems/row-with-maximum-ones/", solution: SOL_BS_ROW_MAX1 },
          { id: "bs-2d-search", title: "Search in a 2D Matrix",      difficulty: "Medium", youtubeUrl: "https://youtu.be/Ber2pi2C0j0", solveUrl: "https://leetcode.com/problems/search-a-2d-matrix/description/", solution: SOL_BS_2D },
          { id: "bs-2d-search2", title: "Search in a 2D Matrix II",  difficulty: "Medium", youtubeUrl: "https://youtu.be/9ZbB397jU4k", solveUrl: "https://leetcode.com/problems/search-a-2d-matrix-ii/description/", solution: SOL_BS_2D2 },
          { id: "bs-peak2",     title: "Find Peak Element II",       difficulty: "Medium", youtubeUrl: "https://youtu.be/nGGp5XBzC4g", solveUrl: "https://leetcode.com/problems/find-a-peak-element-ii/description/", solution: SOL_BS_PEAK2 },
          { id: "bs-matrix-median", title: "Matrix Median",          difficulty: "Hard",   youtubeUrl: "https://youtu.be/Blzp9iuhZqo", solveUrl: "https://www.geeksforgeeks.org/problems/median-in-a-row-wise-sorted-matrix1527/1", solution: SOL_BS_MATRIX_MEDIAN },
        ],
      },
    ],
  },
  {
    id: "sorting",
    title: "Sorting Algorithms",
    subSections: [
      {
        id: "sort-techniques",
        title: "Sorting Techniques",
        problems: [
          { id: "srt-selection",     title: "Selection Sort",           difficulty: "Easy",   youtubeUrl: "https://youtu.be/ee80YmiaSVQ", solveUrl: "https://www.geeksforgeeks.org/dsa/selection-sort-algorithm-2/", solution: SOL_SRT_SELECTION },
          { id: "srt-bubble",        title: "Bubble Sort",              difficulty: "Easy",   youtubeUrl: "https://youtu.be/Z_AUiH8OUFo", solveUrl: "https://www.geeksforgeeks.org/dsa/bubble-sort-algorithm/", solution: SOL_SRT_BUBBLE },
          { id: "srt-insertion",     title: "Insertion Sort",           difficulty: "Easy",   youtubeUrl: "https://youtu.be/R_wDA-PmGE4", solveUrl: "https://www.geeksforgeeks.org/dsa/insertion-sort-algorithm/", solution: SOL_SRT_INSERTION },
          { id: "srt-merge",         title: "Merge Sort",               difficulty: "Medium", youtubeUrl: "https://youtu.be/cVZMah9kEjI", solveUrl: "https://www.geeksforgeeks.org/dsa/merge-sort/", solution: SOL_SRT_MERGE },
          { id: "srt-rec-bubble",    title: "Recursive Bubble Sort",    difficulty: "Easy",   youtubeUrl: "https://youtu.be/Vca808JTbI8", solveUrl: "https://www.geeksforgeeks.org/dsa/recursive-bubble-sort/", solution: SOL_SRT_REC_BUBBLE },
          { id: "srt-rec-insertion", title: "Recursive Insertion Sort", difficulty: "Easy",   youtubeUrl: "https://youtu.be/K0zTIF3rm9s", solveUrl: "https://www.geeksforgeeks.org/dsa/recursive-insertion-sort/", solution: SOL_SRT_REC_INSERTION },
          { id: "srt-quick",         title: "Quick Sort",               difficulty: "Medium", youtubeUrl: "https://youtu.be/9KBwdDEwal8", solveUrl: "https://www.geeksforgeeks.org/dsa/quick-sort-algorithm/", solution: SOL_SRT_QUICK },
        ],
      },
    ],
  },
  {
    id: "strings",
    title: "Strings",
    subSections: [
      {
        id: "str-basics",
        title: "Strings Basics",
        problems: [
          { id: "as-str-palindrome", title: "Check if String is Palindrome or Not", difficulty: "Easy", youtubeUrl: "https://youtu.be/JCQbBGxTW0M", solveUrl: "https://www.geeksforgeeks.org/problems/palindrome-string0817/1", solution: SOL_AS_STR_PALINDROME },
        ],
      },
      {
        id: "str-easy",
        title: "Easy Problems",
        problems: [
          { id: "str-remove-outer", title: "Remove Outermost Parentheses",     difficulty: "Easy",   youtubeUrl: "https://youtu.be/yjso9jkYPbs", solveUrl: "https://leetcode.com/problems/remove-outermost-parentheses/description/", solution: SOL_STR_REMOVE_OUTER },
          { id: "str-reverse-words", title: "Reverse Words in a String",        difficulty: "Medium", youtubeUrl: "https://youtu.be/vhnRAaJybpA", solveUrl: "https://leetcode.com/problems/reverse-words-in-a-string/description/", solution: SOL_STR_REVERSE_WORDS },
          { id: "str-largest-odd",  title: "Largest Odd Number in a String",    difficulty: "Easy",   youtubeUrl: "https://youtu.be/eICBvqI4qTE", solveUrl: "https://leetcode.com/problems/largest-odd-number-in-string/description/", solution: SOL_STR_LARGEST_ODD },
          { id: "str-lcp",          title: "Longest Common Prefix",             difficulty: "Easy",   youtubeUrl: "https://youtu.be/0sWShKIJoo4", solveUrl: "https://leetcode.com/problems/longest-common-prefix/description/", solution: SOL_STR_LCP },
          { id: "str-isomorphic",   title: "Isomorphic Strings",                difficulty: "Easy",   youtubeUrl: "https://youtu.be/7yF-U1hLEqQ", solveUrl: "https://leetcode.com/problems/isomorphic-strings/description/", solution: SOL_STR_ISOMORPHIC },
          { id: "str-rotate",       title: "Rotate String",                     difficulty: "Easy",   youtubeUrl: "https://youtu.be/UC2q9RaXNfo", solveUrl: "https://leetcode.com/problems/rotate-string/description/", solution: SOL_STR_ROTATE },
          { id: "str-anagram",      title: "Check if Two Strings are Anagram",  difficulty: "Easy",   youtubeUrl: "https://youtu.be/4R12dHnTYJw", solveUrl: "https://leetcode.com/problems/valid-anagram/", solution: SOL_STR_ANAGRAM },
        ],
      },
      {
        id: "str-medium",
        title: "Medium Problems",
        problems: [
          { id: "str-sort-freq",    title: "Sort Characters by Frequency",         difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=OXdXc9HTrIg", solveUrl: "https://leetcode.com/problems/sort-characters-by-frequency/description/", solution: SOL_STR_SORT_FREQ },
          { id: "str-max-depth",    title: "Maximum Nesting Depth of the Parentheses", difficulty: "Easy", youtubeUrl: "https://www.youtube.com/watch?v=FiQFJvCvWK4", solveUrl: "https://leetcode.com/problems/maximum-nesting-depth-of-the-parentheses/description/", solution: SOL_STR_MAX_DEPTH },
          { id: "str-roman",        title: "Roman to Integer",                     difficulty: "Easy",   youtubeUrl: "https://www.youtube.com/watch?v=3jdxYj3DD98", solveUrl: "https://leetcode.com/problems/roman-to-integer/description/", solution: SOL_STR_ROMAN },
          { id: "str-atoi",         title: "String to Integer (atoi)",             difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=qZoFJKyHQ98", solveUrl: "https://leetcode.com/problems/string-to-integer-atoi/description/", solution: SOL_STR_ATOI },
          { id: "str-count-substr", title: "Count Number of Substrings",           difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=WCyAWsj9sgI", solveUrl: "https://www.geeksforgeeks.org/problems/count-substring/1", solution: SOL_STR_COUNT_SUBSTR },
          { id: "str-lps",          title: "Longest Palindromic Substring",        difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=XYQecbcd6_c&t=6s", solveUrl: "https://leetcode.com/problems/longest-palindromic-substring/description/", solution: SOL_STR_LPS },
          { id: "str-beauty",       title: "Sum of Beauty of All Substrings",      difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=ARLutVfhw2I", solveUrl: "https://leetcode.com/problems/sum-of-beauty-of-all-substrings/description/", solution: SOL_STR_BEAUTY },
          { id: "str-reverse-words2", title: "Reverse Every Word in a String",     difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=_d0T_2Lk2qA", solveUrl: "https://leetcode.com/problems/reverse-words-in-a-string/description/", solution: SOL_STR_REVERSE_WORDS2 },
        ],
      },
    ],
  },
  {
    id: "linked-list",
    title: "Linked List",
    subSections: [
      {
        id: "ll-learn",
        title: "Learn Singly Linked List",
        problems: [
          { id: "ll-intro",        title: "Introduction to Singly LinkedList",        difficulty: "Easy",   youtubeUrl: "https://www.youtube.com/watch?v=N6dOwBde7-M&t=243s", solveUrl: "https://www.geeksforgeeks.org/dsa/singly-linked-list-tutorial/", solution: SOL_INTRO },
          { id: "ll-insert-head",  title: "Insertion at the head of Linked List",     difficulty: "Easy",   youtubeUrl: "https://www.youtube.com/watch?v=DneLxrPmmsw",         solveUrl: "https://www.hackerrank.com/challenges/insert-a-node-at-the-head-of-a-linked-list/problem", solution: SOL_INSERT_HEAD },
          { id: "ll-delete-head",  title: "Deletion of the head of LL",               difficulty: "Easy",   youtubeUrl: "https://www.youtube.com/watch?v=-rcIWx-JTxw",         solveUrl: "https://leetcode.com/problems/delete-node-in-a-linked-list/", solution: SOL_DELETE_HEAD },
          { id: "ll-length",       title: "Find the length of the Linked List",       difficulty: "Easy",   youtubeUrl: "https://www.youtube.com/watch?v=SbGRuk38MvI",         solveUrl: "https://www.geeksforgeeks.org/dsa/find-length-of-a-linked-list-iterative-and-recursive/", solution: SOL_LENGTH },
          { id: "ll-search",       title: "Search in Linked List",                    difficulty: "Easy",   youtubeUrl: "https://www.youtube.com/watch?v=tgFeh0mSDMM",         solveUrl: "https://www.geeksforgeeks.org/dsa/search-an-element-in-a-linked-list-iterative-and-recursive/", solution: SOL_SEARCH },
          { id: "ll-middle",       title: "Middle of a LinkedList [Tortoise-Hare]",   difficulty: "Easy",   youtubeUrl: "https://www.youtube.com/watch?v=IPaMfcxQtP0&t=65s",   solveUrl: "https://leetcode.com/problems/middle-of-the-linked-list/description/", solution: SOL_MIDDLE },
          { id: "ll-reverse-iter", title: "Reverse a LinkedList [Iterative]",         difficulty: "Easy",   youtubeUrl: "https://www.youtube.com/watch?v=G0_I-ZF0S38",         solveUrl: "https://leetcode.com/problems/reverse-linked-list/", solution: SOL_REVERSE_ITER },
          { id: "ll-reverse-rec",  title: "Reverse a LinkedList [Recursive]",         difficulty: "Easy",   youtubeUrl: "https://www.youtube.com/watch?v=XgABnoJLtG4",         solveUrl: "https://leetcode.com/problems/reverse-linked-list/description/", solution: SOL_REVERSE_REC },
        ],
      },
      {
        id: "ll-medium",
        title: "Medium Problems of Linked List",
        problems: [
          { id: "ll-detect-loop",  title: "Detect a loop in LL",                       difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=gBTe7lFR3vc",        solveUrl: "https://leetcode.com/problems/linked-list-cycle/", solution: SOL_DETECT_LOOP },
          { id: "ll-odd-even",     title: "Segregate odd and even nodes in LL",        difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=WoUAs7R3Ao4",        solveUrl: "https://leetcode.com/problems/odd-even-linked-list/", solution: SOL_ODD_EVEN },
          { id: "ll-sort",         title: "Sort LL",                                   difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=0ougDTvVOFI",        solveUrl: "https://leetcode.com/problems/sort-list/", solution: SOL_SORT },
          { id: "ll-rotate",       title: "Rotate a LL",                               difficulty: "Hard",   youtubeUrl: "https://www.youtube.com/watch?v=UcGtPs2LE_c",        solveUrl: "https://leetcode.com/problems/rotate-list/description/", solution: SOL_ROTATE },
          { id: "ll-add-two",      title: "Add two numbers in Linked List",            difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=KMS0WFxrsT8",        solveUrl: "https://leetcode.com/problems/add-two-numbers/", solution: SOL_ADD_TWO },
          { id: "ll-delete-middle", title: "Delete the middle node in LL",             difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=WT0O4TTjyNc",        solveUrl: "https://leetcode.com/problems/delete-the-middle-node-of-a-linked-list/description/", solution: SOL_DELETE_MIDDLE },
        ],
      },
    ],
  },
  {
    id: "recursion",
    title: "Recursion",
    subSections: [
      {
        id: "rec-stronghold",
        title: "Get a Strong Hold",
        problems: [
          { id: "rec-atoi",          title: "Recursive Implementation of atoi()",  difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=2I9XO8jwZCA", solveUrl: "https://leetcode.com/problems/string-to-integer-atoi/", solution: SOL_REC_ATOI },
          { id: "rec-pow",           title: "Pow(x, n)",                           difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=g9YQyYi4IQQ", solveUrl: "https://leetcode.com/problems/powx-n/description/", solution: SOL_REC_POW },
          { id: "rec-good-numbers",  title: "Count Good Numbers",                  difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=ZhLyJpBVU1s", solveUrl: "https://leetcode.com/problems/count-good-numbers/description/", solution: SOL_REC_GOOD },
          { id: "rec-reverse-stack", title: "Reverse a Stack",                     difficulty: "Easy",   youtubeUrl: "https://www.youtube.com/watch?v=z0bS9ULg5to", solveUrl: "https://www.geeksforgeeks.org/dsa/reverse-a-stack/", solution: SOL_REC_REVSTACK },
        ],
      },
      {
        id: "rec-subsequences",
        title: "Subsequences Pattern",
        problems: [
          { id: "rec-binary-strings", title: "Generate Binary Strings Without Consecutive 1s", difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=H7tshfFTSvw", solveUrl: "https://www.geeksforgeeks.org/dsa/generate-binary-strings-without-consecutive-1s/", solution: SOL_REC_BINSTR },
          { id: "rec-gen-paren",      title: "Generate Parentheses",                  difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=s9fokUqJ76A", solveUrl: "https://leetcode.com/problems/generate-parentheses/", solution: SOL_REC_PAREN },
          { id: "rec-count-subseq-k", title: "Count all subsequences with sum K",     difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=fFVZt-6sgyo", solveUrl: "https://www.geeksforgeeks.org/problems/check-if-there-exists-a-subsequence-with-sum-k/1", solution: SOL_REC_SUBSEQK },
          { id: "rec-comb-sum",       title: "Combination Sum",                       difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=GBKI9VSKdGg", solveUrl: "https://leetcode.com/problems/combination-sum/", solution: SOL_REC_COMBSUM },
          { id: "rec-subsets",        title: "Subsets I",                             difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=REOH22Xwdkk", solveUrl: "https://www.geeksforgeeks.org/problems/subset-sums2234/1", solution: SOL_REC_SUBSETS },
          { id: "rec-comb-sum-iii",   title: "Combination Sum III",                   difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=rP_K3WJnRR4", solveUrl: "https://leetcode.com/problems/combination-sum-iii/", solution: SOL_REC_COMB3 },
        ],
      },
      {
        id: "rec-combos",
        title: "Trying Out All Combos [Hard]",
        problems: [
          { id: "rec-palindrome-part", title: "Palindrome Partitioning", difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=3jvWodd7ht0", solveUrl: "https://leetcode.com/problems/palindrome-partitioning/", solution: SOL_REC_PALPART },
          { id: "rec-word-search",     title: "Word Search",             difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=pfiQ_PS1g8E", solveUrl: "https://leetcode.com/problems/word-search/description/", solution: SOL_REC_WORDSEARCH },
          { id: "rec-rat-maze",        title: "Rat in a Maze",           difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=bLGZhJlt4y0", solveUrl: "https://www.geeksforgeeks.org/problems/rat-in-a-maze-problem/1", solution: SOL_REC_RATMAZE },
          { id: "rec-sudoku",          title: "Sudoku Solver",           difficulty: "Hard",   youtubeUrl: "https://www.youtube.com/watch?v=TjFXEUCMqI8", solveUrl: "https://leetcode.com/problems/sudoku-solver/description/", solution: SOL_REC_SUDOKU },
        ],
      },
    ],
  },
  {
    id: "stacks-queues",
    title: "Stack & Queues",
    subSections: [
      {
        id: "stk-learning",
        title: "Learning",
        problems: [
          { id: "stk-stack-arr",     title: "Implement Stack using Arrays",  difficulty: "Easy",   youtubeUrl: "https://www.youtube.com/watch?v=GYptUgnIM_I", solveUrl: "https://www.geeksforgeeks.org/problems/implement-stack-using-array/1", solution: SOL_STK_STACK_ARR },
          { id: "stk-queue-arr",     title: "Implement Queue using Arrays",  difficulty: "Easy",   youtubeUrl: "https://www.youtube.com/watch?v=M6GnoUDpqEE", solveUrl: "https://www.geeksforgeeks.org/problems/implement-queue-using-array/1", solution: SOL_STK_QUEUE_ARR },
          { id: "stk-stack-using-q", title: "Implement Stack using Queue",   difficulty: "Easy",   youtubeUrl: "https://www.youtube.com/watch?v=rW4vm0-DLYc", solveUrl: "https://leetcode.com/problems/implement-stack-using-queues/", solution: SOL_STK_STACK_USING_Q },
          { id: "stk-queue-using-s", title: "Implement Queue using Stack",   difficulty: "Easy",   youtubeUrl: "https://www.youtube.com/watch?v=eanwa3ht3YQ", solveUrl: "https://leetcode.com/problems/implement-queue-using-stacks/description/", solution: SOL_STK_QUEUE_USING_S },
          { id: "stk-balanced",      title: "Balanced Parenthesis",          difficulty: "Easy",   youtubeUrl: "https://www.youtube.com/watch?v=WTzjTskDFMg", solveUrl: "https://leetcode.com/problems/valid-parentheses/description/", solution: SOL_STK_BALANCED },
          { id: "stk-min-stack",     title: "Implement Min Stack",           difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=qkLl7nAwDPo", solveUrl: "https://leetcode.com/problems/min-stack/description/", solution: SOL_STK_MIN },
        ],
      },
      {
        id: "stk-conversion",
        title: "Prefix, Infix, Postfix Conversions",
        problems: [
          { id: "stk-infix-post", title: "Infix to Postfix Conversion", difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=vXPL6UavUeA", solveUrl: "https://www.geeksforgeeks.org/dsa/convert-infix-expression-to-postfix-expression/", solution: SOL_STK_INFIX_POST },
          { id: "stk-pre-infix",  title: "Prefix to Infix Conversion",  difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=b6m4f2xwRjM", solveUrl: "https://www.geeksforgeeks.org/dsa/prefix-infix-conversion/", solution: SOL_STK_PRE_INFIX },
          { id: "stk-pre-post",   title: "Prefix to Postfix Conversion", difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=jZxII0guwUo", solveUrl: "https://www.geeksforgeeks.org/problems/prefix-to-postfix-conversion/1", solution: SOL_STK_PRE_POST },
          { id: "stk-infix-pre",  title: "Infix to Prefix Conversion",  difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=7cnRfPvvy9k", solveUrl: "https://www.geeksforgeeks.org/problems/infix-to-prefix-notation/1", solution: SOL_STK_INFIX_PRE },
        ],
      },
      {
        id: "stk-monotonic",
        title: "Monotonic Stack / Queue [VVV. Imp]",
        problems: [
          { id: "stk-nge",          title: "Next Greater Element",      difficulty: "Easy",   youtubeUrl: "https://www.youtube.com/watch?v=68a1Dc_qVq4", solveUrl: "https://leetcode.com/problems/next-greater-element-i/", solution: SOL_STK_NGE },
          { id: "stk-trap",         title: "Trapping Rainwater",        difficulty: "Hard",   youtubeUrl: "https://www.youtube.com/watch?v=ZI2z5pq0TqA", solveUrl: "https://leetcode.com/problems/trapping-rain-water/", solution: SOL_STK_TRAP },
          { id: "stk-subarr-min",   title: "Sum of Subarray Minimums",  difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=aX1F2-DrBkQ", solveUrl: "https://leetcode.com/problems/sum-of-subarray-minimums/", solution: SOL_STK_SUBARR_MIN },
          { id: "stk-subarr-range", title: "Sum of Subarray Ranges",    difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=gIrMptNPf5M", solveUrl: "https://leetcode.com/problems/sum-of-subarray-ranges/description/", solution: SOL_STK_SUBARR_RANGE },
          { id: "stk-remove-k",     title: "Remove K Digits",           difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=cFabMOnJaq0", solveUrl: "https://leetcode.com/problems/remove-k-digits/description/", solution: SOL_STK_REMOVE_K },
        ],
      },
      {
        id: "stk-impl",
        title: "Implementation Problems",
        problems: [
          { id: "stk-sliding-max", title: "Sliding Window Maximum", difficulty: "Hard",   youtubeUrl: "https://www.youtube.com/watch?v=DfljaUwZsOk", solveUrl: "https://leetcode.com/problems/sliding-window-maximum/", solution: SOL_STK_SLIDING_MAX },
          { id: "stk-stock-span",  title: "Stock Span Problem",     difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=eay-zoSRkVc", solveUrl: "https://leetcode.com/problems/online-stock-span/description/", solution: SOL_STK_STOCK_SPAN },
          { id: "stk-celebrity",   title: "Celebrity Problem",      difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=cEadsbTeze4", solveUrl: "https://www.geeksforgeeks.org/dsa/the-celebrity-problem/", solution: SOL_STK_CELEBRITY },
        ],
      },
    ],
  },
  {
    id: "sliding-window",
    title: "Sliding Window & Two Pointer",
    subSections: [
      {
        id: "sw-medium",
        title: "Medium Problems",
        problems: [
          { id: "sw-longest-unique", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=wiGpQwVHdE0", solveUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/description/", solution: SOL_SW_LONGEST_UNIQUE },
          { id: "sw-max-ones",       title: "Max Consecutive Ones III",                        difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=HsGKI02yw6M", solveUrl: "https://leetcode.com/problems/max-consecutive-ones-iii/description/", solution: SOL_SW_MAX_ONES },
          { id: "sw-fruit",          title: "Fruit Into Baskets",                              difficulty: "Medium", solveUrl: "https://leetcode.com/problems/fruit-into-baskets/", solution: SOL_SW_FRUIT },
          { id: "sw-char-replace",   title: "Longest Repeating Character Replacement",         difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=gqXU1UyA8pk", solveUrl: "https://leetcode.com/problems/longest-repeating-character-replacement/description/", solution: SOL_SW_CHAR_REPLACE },
          { id: "sw-binary-sum",     title: "Binary Subarrays With Sum",                       difficulty: "Medium", solveUrl: "https://leetcode.com/problems/binary-subarrays-with-sum/", solution: SOL_SW_BINARY_SUM },
          { id: "sw-nice",           title: "Count Number of Nice Subarrays",                  difficulty: "Medium", solveUrl: "https://leetcode.com/problems/count-number-of-nice-subarrays/", solution: SOL_SW_NICE },
          { id: "sw-three-chars",    title: "Number of Substrings Containing All Three Characters", difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=iSf7d2ldp70", solveUrl: "https://leetcode.com/problems/number-of-substrings-containing-all-three-characters/", solution: SOL_SW_THREE_CHARS },
          { id: "sw-max-cards",      title: "Maximum Points You Can Obtain from Cards",        difficulty: "Medium", solveUrl: "https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/", solution: SOL_SW_MAX_CARDS },
        ],
      },
      {
        id: "sw-hard",
        title: "Hard Problems",
        problems: [
          { id: "sw-k-distinct",    title: "Longest Substring With At Most K Distinct Characters", difficulty: "Hard", youtubeUrl: "https://www.youtube.com/watch?v=teM9ZsVRQyc", solveUrl: "https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/description/", solution: SOL_SW_K_DISTINCT },
          { id: "sw-k-different",   title: "Subarrays with K Different Integers",                 difficulty: "Hard", youtubeUrl: "https://www.youtube.com/watch?v=etI6HqWVa8U", solveUrl: "https://leetcode.com/problems/subarrays-with-k-different-integers/description/", solution: SOL_SW_K_DIFFERENT },
          { id: "sw-min-window-sub", title: "Minimum Window Substring",                           difficulty: "Hard", youtubeUrl: "https://www.youtube.com/watch?v=jSto0O4AJbM", solveUrl: "https://leetcode.com/problems/minimum-window-substring/description/", solution: SOL_SW_MIN_WINDOW_SUB },
          { id: "sw-min-window-seq", title: "Minimum Window Subsequence",                         difficulty: "Hard", youtubeUrl: "https://www.youtube.com/watch?v=W2DvQcDPD9A", solveUrl: "https://leetcode.com/problems/minimum-window-subsequence/description/", solution: SOL_SW_MIN_WINDOW_SEQ },
        ],
      },
    ],
  },
  {
    id: "heaps",
    title: "Heaps / Priority Queue",
    subSections: [
      {
        id: "heaps-learning",
        title: "Learning",
        problems: [
          { id: "heap-theory",    title: "Heaps (Theory)",                  difficulty: "Easy",   youtubeUrl: "https://www.youtube.com/watch?v=0wPlzMU-k00", solveUrl: "https://www.geeksforgeeks.org/dsa/heap-data-structure/", solution: SOL_HEAP_THEORY },
          { id: "heap-min-impl",  title: "Implement Min Heap",              difficulty: "Easy",   youtubeUrl: "https://www.youtube.com/watch?v=uzqKs5t9_gk", solveUrl: "https://www.geeksforgeeks.org/problems/min-heap-implementation/1", solution: SOL_HEAP_MIN },
          { id: "heap-kth-array", title: "K-th Largest Element in an Array", difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=XEmy13g1Qxc", solveUrl: "https://leetcode.com/problems/kth-largest-element-in-an-array/", solution: SOL_HEAP_KTH_ARRAY },
          { id: "heap-sort-k",    title: "Sort a K-Sorted Array",           difficulty: "Easy",   youtubeUrl: "https://www.youtube.com/watch?v=tJK7vjNKdLY", solveUrl: "https://www.geeksforgeeks.org/problems/k-sorted-array1610/1", solution: SOL_HEAP_SORT_K },
          { id: "heap-merge-k",   title: "Merge K Sorted Lists",            difficulty: "Hard",   youtubeUrl: "https://www.youtube.com/watch?v=q5a5OiGbT6Q", solveUrl: "https://leetcode.com/problems/merge-k-sorted-lists/", solution: SOL_HEAP_MERGE_K },
        ],
      },
      {
        id: "heaps-medium",
        title: "Medium Problems",
        problems: [
          { id: "heap-kth-stream", title: "Kth Largest Element in a Stream", difficulty: "Easy",   youtubeUrl: "https://www.youtube.com/watch?v=hOjcdrqMoQ8", solveUrl: "https://leetcode.com/problems/kth-largest-element-in-a-stream/description/", solution: SOL_HEAP_KTH_STREAM },
          { id: "heap-max-sum",    title: "Maximum Sum Combination",         difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=KWgh9keTRAU", solveUrl: "https://www.geeksforgeeks.org/problems/maximum-sum-combination/1", solution: SOL_HEAP_MAX_SUM_COMBO },
        ],
      },
      {
        id: "heaps-hard",
        title: "Hard Problems",
        problems: [
          { id: "heap-top-k", title: "Top K Frequent Elements", difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=YPTqKIgVk-k", solveUrl: "https://leetcode.com/problems/top-k-frequent-elements/", solution: SOL_HEAP_TOP_K_FREQ },
        ],
      },
    ],
  },
  {
    id: "trees",
    title: "Binary Trees",
    subSections: [
      {
        id: "tree-traversals",
        title: "Traversals",
        problems: [
          { id: "tree-intro",          title: "Introduction to Trees",            difficulty: "Easy",   youtubeUrl: "https://www.youtube.com/watch?v=_ANrF3FJm7I", solveUrl: "https://www.geeksforgeeks.org/dsa/introduction-to-tree-data-structure/", solution: SOL_TREE_INTRO },
          { id: "tree-all-traversals", title: "Pre, Post, Inorder in One Traversal", difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=ySp2epYvgTE", solveUrl: "https://www.geeksforgeeks.org/dsa/preorder-postorder-and-inorder-traversal-of-a-binary-tree-using-a-single-stack/", solution: SOL_TREE_ALL },
          { id: "tree-preorder",       title: "Preorder Traversal",               difficulty: "Easy",   youtubeUrl: "https://www.youtube.com/watch?v=afTpieEZXck", solveUrl: "https://leetcode.com/problems/binary-tree-preorder-traversal/", solution: SOL_TREE_PRE },
          { id: "tree-inorder",        title: "Inorder Traversal",                difficulty: "Easy",   youtubeUrl: "https://www.youtube.com/watch?v=g_S5WuasWUE", solveUrl: "https://leetcode.com/problems/binary-tree-inorder-traversal/description/", solution: SOL_TREE_IN },
          { id: "tree-postorder",      title: "Postorder Traversal",              difficulty: "Easy",   youtubeUrl: "https://www.youtube.com/watch?v=QhszUQhGGlA", solveUrl: "https://leetcode.com/problems/binary-tree-postorder-traversal/", solution: SOL_TREE_POST },
          { id: "tree-levelorder",     title: "Level Order Traversal",            difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=6ZnyEApgFYg", solveUrl: "https://leetcode.com/problems/binary-tree-level-order-traversal/", solution: SOL_TREE_LEVEL },
        ],
      },
      {
        id: "tree-medium",
        title: "Medium Problems",
        problems: [
          { id: "tree-maxdepth",  title: "Maximum Depth of Binary Tree",   difficulty: "Easy",   youtubeUrl: "https://www.youtube.com/watch?v=hTM3phVI6YQ", solveUrl: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", solution: SOL_TREE_DEPTH },
          { id: "tree-balanced",  title: "Check for Balanced Binary Tree", difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=QfJsau0ItOY", solveUrl: "https://leetcode.com/problems/balanced-binary-tree/", solution: SOL_TREE_BALANCED },
          { id: "tree-diameter",  title: "Diameter of Binary Tree",        difficulty: "Easy",   youtubeUrl: "https://www.youtube.com/watch?v=K81C31ytOZE", solveUrl: "https://leetcode.com/problems/diameter-of-binary-tree/description/", solution: SOL_TREE_DIAMETER },
          { id: "tree-maxpath",   title: "Maximum Path Sum",               difficulty: "Hard",   youtubeUrl: "https://www.youtube.com/watch?v=Hr5cWUld4vU", solveUrl: "https://leetcode.com/problems/binary-tree-maximum-path-sum/description/", solution: SOL_TREE_MAXPATH },
          { id: "tree-zigzag",    title: "Zig Zag or Spiral Traversal",    difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=igbboQbiwqw", solveUrl: "https://leetcode.com/problems/boundary-of-binary-tree/", solution: SOL_TREE_ZIGZAG },
          { id: "tree-vertical",  title: "Vertical Order Traversal",       difficulty: "Hard",   youtubeUrl: "https://www.youtube.com/watch?v=q_a6lpbKJdw", solveUrl: "https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/", solution: SOL_TREE_VERTICAL },
          { id: "tree-rightview", title: "Right / Left View of Binary Tree", difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=d4zLyf32e3I", solveUrl: "https://leetcode.com/problems/binary-tree-right-side-view/", solution: SOL_TREE_RIGHTVIEW },
        ],
      },
    ],
  },
  {
    id: "bst",
    title: "Binary Search Trees",
    subSections: [
      {
        id: "bst-basics",
        title: "BST Basics",
        problems: [
          { id: "bst-intro",  title: "Introduction to BST",        difficulty: "Easy", youtubeUrl: "https://www.youtube.com/watch?v=p7-9UvDQZ3w", solveUrl: "https://www.geeksforgeeks.org/dsa/introduction-to-binary-search-tree/", solution: SOL_BST_INTRO },
          { id: "bst-search", title: "Search in a Binary Search Tree", difficulty: "Easy", youtubeUrl: "https://www.youtube.com/watch?v=KcNt6v_56cc", solveUrl: "https://leetcode.com/problems/search-in-a-binary-search-tree/", solution: SOL_BST_SEARCH },
        ],
      },
      {
        id: "bst-ops",
        title: "BST Operations",
        problems: [
          { id: "bst-insert",   title: "Insert a Node in BST",           difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=Cpg8f79luEA", solveUrl: "https://leetcode.com/problems/insert-into-a-binary-search-tree/description/", solution: SOL_BST_INSERT },
          { id: "bst-delete",   title: "Delete a Node in BST",           difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=LFzAoJJt92M", solveUrl: "https://leetcode.com/problems/delete-node-in-a-bst/description/", solution: SOL_BST_DELETE },
          { id: "bst-validate", title: "Check if a Tree is a BST",       difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=f-sj7I5oXEI", solveUrl: "https://leetcode.com/problems/validate-binary-search-tree/", solution: SOL_BST_VALIDATE },
        ],
      },
    ],
  },
  {
    id: "graphs",
    title: "Graphs",
    subSections: [
      {
        id: "graph-basics",
        title: "BFS / DFS & Basics",
        problems: [
          { id: "graph-intro",      title: "Introduction to Graph",          difficulty: "Easy",   youtubeUrl: "https://www.youtube.com/watch?v=M3_pLsDdeuU", solveUrl: "https://www.geeksforgeeks.org/dsa/introduction-to-graphs-data-structure-and-algorithm-tutorials/", solution: SOL_GRAPH_INTRO },
          { id: "graph-repr",       title: "Graph Representation",           difficulty: "Easy",   youtubeUrl: "https://www.youtube.com/watch?v=-VgHk7UMPP4", solveUrl: "https://www.geeksforgeeks.org/dsa/graph-and-its-representations/", solution: SOL_GRAPH_REPR },
          { id: "graph-components", title: "Connected Components",           difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=lea-Wl_uWXY", solveUrl: "https://www.geeksforgeeks.org/dsa/connected-components-in-an-undirected-graph/", solution: SOL_GRAPH_COMPONENTS },
          { id: "graph-dfs",        title: "DFS Traversal",                  difficulty: "Easy",   youtubeUrl: "https://www.youtube.com/watch?v=cS-198wtfj0", solveUrl: "https://www.geeksforgeeks.org/dsa/depth-first-search-or-dfs-for-a-graph/", solution: SOL_GRAPH_DFS },
        ],
      },
      {
        id: "graph-problems",
        title: "Problems on Traversal",
        problems: [
          { id: "graph-provinces",  title: "Number of Provinces",                    difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=ACzkVtewUYA", solveUrl: "https://leetcode.com/problems/number-of-provinces/description/", solution: SOL_GRAPH_PROVINCES },
          { id: "graph-rotten",     title: "Rotten Oranges",                         difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=y704fEOx0s0", solveUrl: "https://leetcode.com/problems/rotting-oranges/", solution: SOL_GRAPH_ROTTEN },
          { id: "graph-cycle-bfs",  title: "Cycle Detection in Undirected Graph (BFS)", difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=vXrv3kruvwE", solveUrl: "https://www.geeksforgeeks.org/dsa/detect-cycle-in-an-undirected-graph-using-bfs/", solution: SOL_GRAPH_CYCLE_BFS },
          { id: "graph-surrounded", title: "Surrounded Regions",                     difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=9z2BunfoZ5Y", solveUrl: "https://leetcode.com/problems/surrounded-regions/", solution: SOL_GRAPH_SURROUNDED },
          { id: "graph-word-ladder", title: "Word Ladder I",                          difficulty: "Hard",   youtubeUrl: "https://www.youtube.com/watch?v=h9iTnkgv05E", solveUrl: "https://leetcode.com/problems/word-ladder/", solution: SOL_GRAPH_WORDLADDER },
          { id: "graph-islands",     title: "Number of Islands",                      difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=pV2kpPD66nE", solveUrl: "https://leetcode.com/problems/number-of-islands/", solution: SOL_GRAPH_ISLANDS },
        ],
      },
      {
        id: "graph-topo",
        title: "Topo Sort & Directed Cycles",
        problems: [
          { id: "graph-dir-cycle-dfs", title: "Cycle Detection in Directed Graph (DFS)", difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=AK7BuT5MgU0", solveUrl: "https://leetcode.com/problems/course-schedule-ii/", solution: SOL_GRAPH_DIR_CYCLE_DFS },
          { id: "graph-detect-dir",    title: "Detect a Cycle in a Directed Graph",      difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=AK7BuT5MgU0", solveUrl: "https://leetcode.com/problems/course-schedule/", solution: SOL_GRAPH_DETECT_DIR },
          { id: "graph-course-1",      title: "Course Schedule I",                       difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=EgI5nU9etnU", solveUrl: "https://leetcode.com/problems/course-schedule/", solution: SOL_GRAPH_COURSE1 },
        ],
      },
      {
        id: "graph-shortest",
        title: "Shortest Path Algorithms",
        problems: [
          { id: "graph-dag-sp",   title: "Shortest Path in DAG",   difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=TXkDpqjDMHA", solveUrl: "https://www.geeksforgeeks.org/problems/shortest-path-in-undirected-graph/1", solution: SOL_GRAPH_DAG_SP },
          { id: "graph-dijkstra", title: "Dijkstra's Algorithm",   difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=bZkzH5x0SKU", solveUrl: "https://www.geeksforgeeks.org/problems/implementing-dijkstra-set-1-adjacency-matrix/1", solution: SOL_GRAPH_DIJKSTRA },
          { id: "graph-bellman",  title: "Bellman Ford Algorithm", difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=obWXjtg0L64", solveUrl: "https://www.geeksforgeeks.org/problems/distance-from-the-source-bellman-ford-algorithm/1", solution: SOL_GRAPH_BELLMAN },
        ],
      },
    ],
  },
  {
    id: "dp",
    title: "Dynamic Programming",
    subSections: [
      {
        id: "dp-1d",
        title: "Learn DP (1D)",
        problems: [
          { id: "dp-intro", title: "Introduction to DP", difficulty: "Easy",   youtubeUrl: "https://www.youtube.com/watch?v=oNoILrFOx2k", solveUrl: "https://www.geeksforgeeks.org/dsa/introduction-to-dynamic-programming-data-structures-and-algorithm-tutorials/", solution: SOL_DP_INTRO },
          { id: "dp-climb", title: "Climbing Stairs",    difficulty: "Easy",   youtubeUrl: "https://www.youtube.com/watch?v=Y0lT9Fck7qI", solveUrl: "https://leetcode.com/problems/climbing-stairs/", solution: SOL_DP_CLIMB },
          { id: "dp-rob",   title: "House Robber",       difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=73r3KWiEvyk", solveUrl: "https://leetcode.com/problems/house-robber-ii/", solution: SOL_DP_ROB },
        ],
      },
      {
        id: "dp-grids",
        title: "DP on Grids",
        problems: [
          { id: "dp-unique-paths", title: "Unique Paths II",          difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=d3UOz7zdE4I", solveUrl: "https://leetcode.com/problems/unique-paths-ii/", solution: SOL_DP_UNIQUE_PATHS },
          { id: "dp-min-path",     title: "Minimum Falling Path Sum", difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=b_F3mz9l-uQ", solveUrl: "https://leetcode.com/problems/minimum-path-sum/", solution: SOL_DP_MIN_PATH },
        ],
      },
      {
        id: "dp-subseq",
        title: "DP on Subsequences",
        problems: [
          { id: "dp-count-subsets", title: "Count Subsets with Sum K", difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=ZHyb-A2Mte4", solveUrl: "https://www.geeksforgeeks.org/dsa/count-of-subsets-with-sum-equal-to-x/", solution: SOL_DP_COUNT_SUBSETS },
          { id: "dp-target-sum",    title: "Target Sum",               difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=g0npyaQtAQM", solveUrl: "https://leetcode.com/problems/target-sum/", solution: SOL_DP_TARGET_SUM },
          { id: "dp-coin2",         title: "Coin Change II",           difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=Mjy4hd2xgrs", solveUrl: "https://leetcode.com/problems/coin-change-ii/", solution: SOL_DP_COIN2 },
        ],
      },
      {
        id: "dp-strings",
        title: "DP on Strings",
        problems: [
          { id: "dp-lcs",       title: "Longest Common Subsequence",   difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=Ua0GhsJSlWM", solveUrl: "https://leetcode.com/problems/longest-common-subsequence/", solution: SOL_DP_LCS },
          { id: "dp-lcsubstr",  title: "Longest Common Substring",     difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=_wP9mWNPL5w", solveUrl: "https://www.geeksforgeeks.org/problems/longest-common-substring1452/1", solution: SOL_DP_LCSUBSTR },
          { id: "dp-lps",       title: "Longest Palindromic Subsequence", difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=bUr8cNWI09Q", solveUrl: "https://leetcode.com/problems/longest-palindromic-subsequence/description/", solution: SOL_DP_LPS },
          { id: "dp-scs",       title: "Shortest Common Supersequence", difficulty: "Hard",   youtubeUrl: "https://www.youtube.com/watch?v=JkjQNJSxXN0", solveUrl: "https://leetcode.com/problems/shortest-common-supersequence/description/", solution: SOL_DP_SCS },
          { id: "dp-edit",      title: "Edit Distance",                difficulty: "Hard",   youtubeUrl: "https://www.youtube.com/watch?v=XYi2-LPrwm4", solveUrl: "https://leetcode.com/problems/edit-distance/", solution: SOL_DP_EDIT },
        ],
      },
      {
        id: "dp-stocks",
        title: "DP on Stocks",
        problems: [
          { id: "dp-stock1", title: "Best Time to Buy and Sell Stock",    difficulty: "Easy",   youtubeUrl: "https://www.youtube.com/watch?v=1pkOgXD63yU", solveUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/description/", solution: SOL_DP_STOCK1 },
          { id: "dp-stock2", title: "Best Time to Buy and Sell Stock II", difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=3SJ3pUkPQMc", solveUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/description/", solution: SOL_DP_STOCK2 },
        ],
      },
      {
        id: "dp-lis",
        title: "LIS & Partition DP",
        problems: [
          { id: "dp-lis-prob",  title: "Longest Increasing Subsequence", difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=cjWnW0hdF1Y", solveUrl: "https://leetcode.com/problems/longest-increasing-subsequence/", solution: SOL_DP_LIS },
          { id: "dp-partition", title: "Partition Array for Maximum Sum", difficulty: "Medium", youtubeUrl: "https://www.youtube.com/watch?v=kWhy4ZUBdOY", solveUrl: "https://leetcode.com/problems/partition-array-for-maximum-sum/", solution: SOL_DP_PARTITION },
          { id: "dp-burst",     title: "Burst Balloons",                 difficulty: "Hard",   youtubeUrl: "https://www.youtube.com/watch?v=VFskby7lUbw", solveUrl: "https://leetcode.com/problems/burst-balloons/", solution: SOL_DP_BURST },
        ],
      },
    ],
  },
];

const DIFF_META: Record<Difficulty, { color: string; label: string }> = {
  Easy:   { color: EASY, label: "Easy" },
  Medium: { color: MED,  label: "Medium" },
  Hard:   { color: HARD, label: "Hard" },
};

// ─── Platform detection for the Solve link ────────────────────────────────────
type Platform = { label: string; short: string; bg: string; fg: string };
function detectPlatform(url?: string): Platform {
  const u = (url || "").toLowerCase();
  if (u.includes("leetcode"))      return { label: "LeetCode",      short: "LC",  bg: "#FFA116", fg: "#1A1A1A" };
  if (u.includes("hackerrank"))    return { label: "HackerRank",    short: "h>",  bg: "#00EA64", fg: "#0A0A0A" };
  if (u.includes("geeksforgeeks")) return { label: "GeeksforGeeks", short: "gfg", bg: "#2F8D46", fg: "#FFFFFF" };
  if (u.includes("codingninjas") || u.includes("codestudio") || u.includes("naukri")) return { label: "Coding Ninjas", short: "CN", bg: "#DF6919", fg: "#FFFFFF" };
  return { label: "Practice", short: "↗", bg: SURF2, fg: MUTE };
}

// ─── localStorage helpers ─────────────────────────────────────────────────────
const DONE_KEY = "upstrides_sheet_done";
const REV_KEY  = "upstrides_sheet_revision";
const SOL_UNLOCK_KEY = "upstrides_sheet_sol_unlocked";

function loadSet(key: string): Set<string> {
  try { const raw = localStorage.getItem(key); return raw ? new Set(JSON.parse(raw) as string[]) : new Set(); }
  catch { return new Set(); }
}
function saveSet(key: string, set: Set<string>) {
  try { localStorage.setItem(key, JSON.stringify([...set])); } catch { /* noop */ }
}

function useIsMobile() {
  const [m, setM] = useState(() => window.innerWidth < 820);
  useEffect(() => {
    const on = () => setM(window.innerWidth < 820);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return m;
}

type Tab = "all" | "revision";
type DiffFilter = "All" | Difficulty;
type SolModal = { problem: SheetProblem; stage: "confirm" | "view" | "limit" } | null;

const UpstridesSheet = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // localStorage acts as an instant cache; the backend (MongoDB) is the source of truth.
  const [done, setDone]         = useState<Set<string>>(() => loadSet(DONE_KEY));
  const [revision, setRevision] = useState<Set<string>>(() => loadSet(REV_KEY));
  const [unlocked, setUnlocked] = useState<Set<string>>(() => loadSet(SOL_UNLOCK_KEY));
  const [quotaLeft, setQuotaLeft] = useState<number>(DAILY_SOLUTION_LIMIT);

  const [tab, setTab]           = useState<Tab>("all");
  const [diffFilter, setDiffFilter] = useState<DiffFilter>("All");
  const [search, setSearch]     = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set([SHEET[0]?.id]));
  // Sub-sections start collapsed; this set tracks the ones the user has opened.
  const [expandedSubs, setExpandedSubs] = useState<Set<string>>(() => new Set());
  const [highlight, setHighlight] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(false);
  const [solModal, setSolModal] = useState<SolModal>(null);
  const [copied, setCopied]     = useState(false);

  // Cache locally so a returning visit paints instantly before the network responds.
  useEffect(() => { saveSet(DONE_KEY, done); }, [done]);
  useEffect(() => { saveSet(REV_KEY, revision); }, [revision]);
  useEffect(() => { saveSet(SOL_UNLOCK_KEY, unlocked); }, [unlocked]);

  // Load the authoritative progress from the backend on mount (survives logout / new device).
  useEffect(() => {
    let alive = true;
    api.student.getSheetProgress()
      .then(p => {
        if (!alive) return;
        setDone(new Set(p.done));
        setRevision(new Set(p.revision));
        setUnlocked(new Set(p.unlocked_solutions));
        setQuotaLeft(p.quota_left);
      })
      .catch(() => { /* offline → keep the localStorage cache */ });
    return () => { alive = false; };
  }, []);

  const allProblems = useMemo(() => SHEET.flatMap(s => s.subSections.flatMap(ss => ss.problems)), []);

  const stats = useMemo(() => {
    const byDiff: Record<Difficulty, { total: number; done: number }> = {
      Easy: { total: 0, done: 0 }, Medium: { total: 0, done: 0 }, Hard: { total: 0, done: 0 },
    };
    for (const p of allProblems) {
      byDiff[p.difficulty].total++;
      if (done.has(p.id)) byDiff[p.difficulty].done++;
    }
    const total = allProblems.length;
    const doneCount = allProblems.filter(p => done.has(p.id)).length;
    return { byDiff, total, doneCount, pct: total ? Math.round((doneCount / total) * 100) : 0 };
  }, [allProblems, done]);

  // Toggle + persist the new set to the backend (best-effort; UI stays responsive).
  const toggleDone = useCallback((id: string) => {
    setDone(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      api.student.setSheetDone([...n]).catch(() => { /* cached locally, retried next change */ });
      return n;
    });
  }, []);
  const toggleRevision = useCallback((id: string) => {
    setRevision(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      api.student.setSheetRevision([...n]).catch(() => {});
      return n;
    });
  }, []);
  const toggleSection = (id: string) => {
    setExpanded(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const toggleSub = (id: string) => {
    setExpandedSubs(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  // ── Solution gate (daily limit enforced by the server) ──
  const openSolution = (p: SheetProblem) => {
    if (!p.solution) return;
    if (unlocked.has(p.id)) { setSolModal({ problem: p, stage: "view" }); return; }
    if (quotaLeft <= 0) { setSolModal({ problem: p, stage: "limit" }); return; }
    setSolModal({ problem: p, stage: "confirm" });
  };
  const confirmUnlock = async () => {
    if (!solModal) return;
    const p = solModal.problem;
    try {
      const res = await api.student.unlockSheetSolution(p.id);
      setQuotaLeft(res.quota_left);
      if (res.unlocked) {
        setUnlocked(prev => new Set(prev).add(p.id));
        setSolModal({ problem: p, stage: "view" });
      } else {
        setSolModal({ problem: p, stage: "limit" });
      }
    } catch {
      // If the server can't be reached, don't hand out the answer.
      setSolModal({ problem: p, stage: "limit" });
    }
  };
  const copySolution = async () => {
    if (!solModal?.problem.solution) return;
    try { await navigator.clipboard.writeText(solModal.problem.solution); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* noop */ }
  };

  const matches = useCallback((p: SheetProblem) => {
    if (tab === "revision" && !revision.has(p.id)) return false;
    if (diffFilter !== "All" && p.difficulty !== diffFilter) return false;
    if (search.trim() && !p.title.toLowerCase().includes(search.trim().toLowerCase())) return false;
    return true;
  }, [tab, revision, diffFilter, search]);

  const pickRandom = () => {
    const pool = allProblems.filter(p => matches(p) && !done.has(p.id));
    const candidates = pool.length ? pool : allProblems.filter(matches);
    if (!candidates.length) return;
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    const sec = SHEET.find(s => s.subSections.some(ss => ss.problems.some(p => p.id === chosen.id)));
    if (sec) setExpanded(prev => new Set(prev).add(sec.id));
    setHighlight(chosen.id);
    setTimeout(() => document.getElementById(`prob-${chosen.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 60);
    setTimeout(() => setHighlight(null), 2600);
  };

  return (
    <div style={{ minHeight: "100vh", background: BG, color: TXT, ...SANS }}>

      {/* ── Top bar ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 30, background: `${BG}E6`, backdropFilter: "blur(8px)", borderBottom: `1px solid ${BORD}`, padding: isMobile ? "12px 16px" : "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => navigate("/portal")} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "transparent", border: "none", color: MUTE, cursor: "pointer", fontSize: "13px", ...MONO }}>
          <ArrowLeft size={15} /> PORTAL
        </button>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
          <Code2 size={16} color={Y} />
          <span style={{ fontWeight: 700, letterSpacing: "-0.01em" }}>DSA Sheet</span>
          <span style={{ fontSize: "9px", fontWeight: 700, color: BG, background: Y, padding: "2px 7px", borderRadius: "10px", letterSpacing: "0.08em", ...MONO }}>A2Z</span>
        </div>
        {/* daily quota pill */}
        <div title="Solutions you can unlock today" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", color: quotaLeft > 0 ? MUTE : HARD, ...MONO }}>
          <Lock size={12} /> {quotaLeft}/{DAILY_SOLUTION_LIMIT}
        </div>
      </div>

      <div style={{ maxWidth: "1080px", margin: "0 auto", padding: isMobile ? "20px 14px 60px" : "32px 28px 80px" }}>

        {/* ── Hero ── */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: isMobile ? "26px" : "34px", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1, margin: 0 }}>
            DSA from <span style={{ color: Y }}>A to Z</span>
          </h1>
          <p style={{ fontSize: "13.5px", color: MUTE, lineHeight: 1.6, marginTop: "10px", maxWidth: "640px" }}>
            This course is made for people who want to learn DSA from A to Z for free in a well-organised and structured manner.{" "}
            <button onClick={() => setShowIntro(v => !v)} style={{ background: "none", border: "none", color: Y, cursor: "pointer", fontWeight: 600, ...SANS, fontSize: "13.5px", padding: 0 }}>
              {showIntro ? "Show less" : "Know more"}
            </button>
          </p>
          {showIntro && (
            <div style={{ marginTop: "12px", padding: "14px 16px", background: SURF, border: `1px solid ${BORD}`, borderRadius: "10px", fontSize: "13px", color: MUTE, lineHeight: 1.7 }}>
              Follow the steps in order. Watch the <strong style={{ color: TXT }}>resource</strong> video, then hit <strong style={{ color: TXT }}>Solve</strong> (or click the problem name) to practise. Stuck? You can unlock up to <strong style={{ color: Y }}>{DAILY_SOLUTION_LIMIT} solutions per day</strong> — try hard first, it's how it sticks. Star tricky ones for <strong style={{ color: TXT }}>Revision</strong>.
            </div>
          )}
        </div>

        {/* ── Cheat sheet banner ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "24px", padding: isMobile ? "14px 16px" : "16px 20px", background: "linear-gradient(135deg, #15171C, #1B1E24)", border: `1px solid ${BORD}`, borderLeft: `3px solid ${Y}`, borderRadius: "12px" }}>
          <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: `${Y}1A`, border: `1px solid ${Y}55`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <BookOpen size={18} color={Y} />
          </div>
          <div style={{ flex: 1, minWidth: "180px" }}>
            <div style={{ fontSize: "13.5px", fontWeight: 700, color: TXT }}>New here? Skim the cheat sheet first.</div>
            <div style={{ fontSize: "12px", color: MUTE, lineHeight: 1.5 }}>Time & space complexity, data types, and every concept — explained simply. Refer or recall anytime.</div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => navigate("/cheat-sheet/python")}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", background: Y, color: BG, border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 700, cursor: "pointer", ...SANS }}>
              <Code2 size={13} /> Python
            </button>
            <button onClick={() => navigate("/cheat-sheet/dsa")}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", background: "transparent", color: Y, border: `1px solid ${Y}55`, borderRadius: "8px", fontSize: "12px", fontWeight: 700, cursor: "pointer", ...SANS }}>
              <Code2 size={13} /> DSA
            </button>
          </div>
        </div>

        {/* ── Progress + difficulty stats ── */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "auto 1fr", gap: "16px", marginBottom: "24px", background: SURF, border: `1px solid ${BORD}`, borderRadius: "14px", padding: isMobile ? "18px" : "22px 26px", alignItems: "center" }}>
          <ProgressRing pct={stats.pct} done={stats.doneCount} total={stats.total} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
            {(["Easy", "Medium", "Hard"] as Difficulty[]).map(d => {
              const s = stats.byDiff[d]; const m = DIFF_META[d];
              const pct = s.total ? (s.done / s.total) * 100 : 0;
              return (
                <div key={d} style={{ background: SURF2, border: `1px solid ${BORD}`, borderRadius: "10px", padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: m.color }}>{m.label}</span>
                    <span style={{ fontSize: "12px", color: MUTE, ...MONO }}>{s.done}/{s.total}</span>
                  </div>
                  <div style={{ height: "5px", background: "#0E1014", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: m.color, borderRadius: "3px", transition: "width 0.4s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Tabs + filters ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px", flexWrap: "wrap" }}>
          <div style={{ display: "inline-flex", background: SURF, border: `1px solid ${BORD}`, borderRadius: "10px", padding: "3px" }}>
            {(["all", "revision"] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{ padding: "7px 14px", background: tab === t ? Y : "transparent", color: tab === t ? BG : MUTE, border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "12.5px", fontWeight: 700, ...SANS, display: "inline-flex", alignItems: "center", gap: "6px" }}>
                {t === "revision" && <Star size={12} fill={tab === t ? BG : "none"} />}
                {t === "all" ? "All Problems" : "Revision"}
                {t === "revision" && <span style={{ ...MONO, fontSize: "10px", opacity: 0.8 }}>{revision.size}</span>}
              </button>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: SURF, border: `1px solid ${BORD}`, borderRadius: "10px", padding: "8px 12px", minWidth: isMobile ? "100%" : "220px", order: isMobile ? 5 : 0 }}>
            <Search size={14} color={MUTE} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search problems…"
              style={{ background: "transparent", border: "none", outline: "none", color: TXT, fontSize: "13px", width: "100%", ...SANS }} />
            {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: MUTE, display: "flex" }}><X size={13} /></button>}
          </div>
          <select value={diffFilter} onChange={e => setDiffFilter(e.target.value as DiffFilter)}
            style={{ background: SURF, border: `1px solid ${BORD}`, borderRadius: "10px", padding: "8px 12px", color: TXT, fontSize: "12.5px", fontWeight: 600, cursor: "pointer", ...SANS, outline: "none" }}>
            <option value="All">Difficulty: All</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <button onClick={pickRandom}
            style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: SURF, border: `1px solid ${BORD}`, borderRadius: "10px", padding: "8px 14px", color: Y, fontSize: "12.5px", fontWeight: 700, cursor: "pointer", ...SANS }}>
            <Shuffle size={14} /> Random
          </button>
        </div>

        {/* ── Sections ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {SHEET.map(section => {
            const secProblems = section.subSections.flatMap(ss => ss.problems);
            const secDone = secProblems.filter(p => done.has(p.id)).length;
            const secVisible = secProblems.filter(matches).length;
            const isOpen = expanded.has(section.id);
            if (secVisible === 0 && (tab === "revision" || diffFilter !== "All" || search.trim())) return null;
            return (
              <div key={section.id} style={{ background: SURF, border: `1px solid ${BORD}`, borderRadius: "14px", overflow: "hidden" }}>
                <button onClick={() => toggleSection(section.id)}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: "14px", padding: isMobile ? "18px 18px" : "22px 26px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}>
                  {isOpen ? <ChevronDown size={22} color={MUTE} /> : <ChevronRight size={22} color={MUTE} />}
                  <span style={{ fontSize: isMobile ? "19px" : "23px", fontWeight: 800, color: TXT, flex: 1, letterSpacing: "-0.015em" }}>{section.title}</span>
                  <span style={{ fontSize: "14px", color: MUTE, ...MONO, whiteSpace: "nowrap" }}>{secDone} / {secProblems.length}</span>
                  <div style={{ width: isMobile ? "70px" : "140px", height: "8px", background: "#0E1014", borderRadius: "4px", overflow: "hidden", flexShrink: 0 }}>
                    <div style={{ height: "100%", width: `${secProblems.length ? (secDone / secProblems.length) * 100 : 0}%`, background: Y, borderRadius: "4px", transition: "width 0.4s ease" }} />
                  </div>
                </button>

                {isOpen && (
                  <div style={{ borderTop: `1px solid ${BORD}` }}>
                    {section.subSections.map(ss => {
                      const visible = ss.problems.filter(matches);
                      if (visible.length === 0) return null;
                      // Collapsed by default — a search/filter forces it open to reveal matches.
                      const filterActive = tab === "revision" || diffFilter !== "All" || !!search.trim();
                      const subOpen = filterActive || expandedSubs.has(ss.id);
                      const subDone = ss.problems.filter(p => done.has(p.id)).length;
                      return (
                        <div key={ss.id}>
                          <button onClick={() => toggleSub(ss.id)}
                            style={{ width: "100%", padding: isMobile ? "14px 18px" : "16px 24px", display: "flex", alignItems: "center", gap: "11px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}>
                            {subOpen ? <ChevronDown size={17} color={MUTE} /> : <ChevronRight size={17} color={MUTE} />}
                            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: Y, flexShrink: 0 }} />
                            <span style={{ fontSize: "16.5px", fontWeight: 700, color: TXT, opacity: 0.95, flex: 1 }}>{ss.title}</span>
                            <span style={{ fontSize: "13px", color: MUTE, ...MONO, whiteSpace: "nowrap" }}>{subDone}/{ss.problems.length}</span>
                            <div style={{ width: isMobile ? "54px" : "96px", height: "6px", background: "#0E1014", borderRadius: "3px", overflow: "hidden", flexShrink: 0 }}>
                              <div style={{ height: "100%", width: `${ss.problems.length ? (subDone / ss.problems.length) * 100 : 0}%`, background: Y, borderRadius: "3px", transition: "width 0.4s ease" }} />
                            </div>
                          </button>

                          {subOpen && (
                            <>
                              {!isMobile && (
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 96px 104px 112px 92px", gap: "10px", padding: "8px 24px", borderBottom: `1px solid ${BORD}`, fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", color: MUTE, ...MONO }}>
                                  <span>PROBLEM</span>
                                  <span style={{ textAlign: "center" }}>RESOURCE</span>
                                  <span style={{ textAlign: "center" }}>SOLVE</span>
                                  <span style={{ textAlign: "center" }}>SOLUTION</span>
                                  <span style={{ textAlign: "center" }}>STATUS</span>
                                </div>
                              )}

                              {visible.map(p => (
                                <ProblemRow
                                  key={p.id} p={p} isMobile={isMobile}
                                  isDone={done.has(p.id)} isRevision={revision.has(p.id)}
                                  isUnlocked={unlocked.has(p.id)} highlight={highlight === p.id}
                                  onToggleDone={() => toggleDone(p.id)}
                                  onToggleRevision={() => toggleRevision(p.id)}
                                  onSolution={() => openSolution(p)}
                                />
                              ))}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {tab === "revision" && revision.size === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: MUTE }}>
            <Star size={32} style={{ opacity: 0.3, marginBottom: "12px" }} />
            <div style={{ fontWeight: 700, color: TXT, marginBottom: "4px" }}>No problems marked for revision yet</div>
            <div style={{ fontSize: "13px" }}>Tap the ☆ on any problem to add it here.</div>
          </div>
        )}
      </div>

      {/* ── Solution modal ── */}
      {solModal && (
        <SolutionModal
          state={solModal} quotaLeft={quotaLeft} copied={copied}
          onClose={() => setSolModal(null)} onConfirm={confirmUnlock} onCopy={copySolution}
        />
      )}
    </div>
  );
};

// ─── Circular progress ring ───────────────────────────────────────────────────
function ProgressRing({ pct, done, total }: { pct: number; done: number; total: number }) {
  const R = 40, C = 2 * Math.PI * R;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      <div style={{ position: "relative", width: "104px", height: "104px", flexShrink: 0 }}>
        <svg width="104" height="104" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="52" cy="52" r={R} fill="none" stroke="#0E1014" strokeWidth="9" />
          <circle cx="52" cy="52" r={R} fill="none" stroke={Y} strokeWidth="9" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C - (C * pct) / 100} style={{ transition: "stroke-dashoffset 0.6s ease" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "22px", fontWeight: 800, color: TXT, lineHeight: 1 }}>{pct}<span style={{ fontSize: "12px", color: MUTE }}>%</span></span>
        </div>
      </div>
      <div>
        <div style={{ fontSize: "11px", color: MUTE, letterSpacing: "0.1em", ...MONO, marginBottom: "4px" }}>OVERALL PROGRESS</div>
        <div style={{ fontSize: "24px", fontWeight: 800, color: TXT, lineHeight: 1 }}>
          {done} <span style={{ color: MUTE, fontWeight: 600, fontSize: "18px" }}>/ {total}</span>
        </div>
        <div style={{ fontSize: "11.5px", color: MUTE, marginTop: "4px" }}>problems solved</div>
      </div>
    </div>
  );
}

// ─── Brand chip for the Solve platform ────────────────────────────────────────
function PlatformChip({ url }: { url?: string }) {
  const plat = detectPlatform(url);
  return (
    <span title={plat.label} style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      minWidth: "36px", height: "32px", padding: "0 10px", borderRadius: "8px",
      background: plat.bg, color: plat.fg, fontSize: "13px", fontWeight: 800, ...MONO,
      letterSpacing: "0.02em", flexShrink: 0,
    }}>
      {plat.short}
    </span>
  );
}

// ─── A single problem row ──────────────────────────────────────────────────────
function ProblemRow({
  p, isMobile, isDone, isRevision, isUnlocked, highlight,
  onToggleDone, onToggleRevision, onSolution,
}: {
  p: SheetProblem; isMobile: boolean; isDone: boolean; isRevision: boolean; isUnlocked: boolean; highlight: boolean;
  onToggleDone: () => void; onToggleRevision: () => void; onSolution: () => void;
}) {
  const [hover, setHover] = useState(false);
  const m = DIFF_META[p.difficulty];

  const star = (
    <button onClick={onToggleRevision} title="Mark for revision"
      style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: "2px", flexShrink: 0 }}>
      <Star size={18} color={isRevision ? Y : "#3A3F47"} fill={isRevision ? Y : "none"} />
    </button>
  );

  // Problem name — clicking opens the Solve link
  const nameEl = p.solveUrl ? (
    <a href={p.solveUrl} target="_blank" rel="noopener noreferrer"
      style={{ fontSize: "16.5px", color: isDone ? MUTE : TXT, fontWeight: 600, textDecoration: isDone ? "line-through" : "none", whiteSpace: isMobile ? "normal" : "nowrap", overflow: "hidden", textOverflow: "ellipsis", cursor: "pointer" }}
      onMouseEnter={e => (e.currentTarget.style.color = Y)}
      onMouseLeave={e => (e.currentTarget.style.color = isDone ? MUTE : TXT)}>
      {p.title}
    </a>
  ) : (
    <span style={{ fontSize: "16.5px", color: isDone ? MUTE : TXT, fontWeight: 600 }}>{p.title}</span>
  );

  const problemCell = (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
      {star}
      <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: m.color, flexShrink: 0 }} title={m.label} />
      {nameEl}
    </div>
  );

  const resourceEl = p.youtubeUrl ? (
    <a href={p.youtubeUrl} target="_blank" rel="noopener noreferrer" title="Watch lecture"
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "9px", border: `1px solid ${BORD}`, background: SURF2, color: "#FF4444" }}>
      <Youtube size={18} />
    </a>
  ) : <span style={{ color: "#3A3F47" }}>–</span>;

  const solveEl = p.solveUrl ? (
    <a href={p.solveUrl} target="_blank" rel="noopener noreferrer" title="Solve on platform"
      style={{ display: "inline-flex", alignItems: "center", gap: "5px", textDecoration: "none" }}>
      <PlatformChip url={p.solveUrl} />
    </a>
  ) : <span style={{ color: "#3A3F47" }}>–</span>;

  const solutionEl = p.solution ? (
    <button onClick={onSolution} title={isUnlocked ? "View solution" : "Unlock solution"}
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "8px 12px", borderRadius: "9px", cursor: "pointer", fontSize: "12.5px", fontWeight: 700, ...MONO, border: `1px solid ${isUnlocked ? "#3B82F6" : BORD}`, background: isUnlocked ? "#3B82F61A" : SURF2, color: isUnlocked ? "#60A5FA" : MUTE }}>
      {isUnlocked ? <Code2 size={14} /> : <Lock size={14} />} {isUnlocked ? "VIEW" : "SOLN"}
    </button>
  ) : <span style={{ color: "#3A3F47" }}>–</span>;

  const statusBtn = (
    <button onClick={onToggleDone}
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", width: isMobile ? "auto" : "100%", padding: "8px 12px", borderRadius: "9px", cursor: "pointer", fontSize: "12.5px", fontWeight: 700, ...MONO, border: `1px solid ${isDone ? EASY : BORD}`, background: isDone ? `${EASY}1A` : SURF2, color: isDone ? EASY : MUTE }}>
      <Check size={14} /> {isDone ? "DONE" : "MARK"}
    </button>
  );

  const rowBg = highlight ? `${Y}14` : hover ? SURF2 : "transparent";

  if (isMobile) {
    return (
      <div id={`prob-${p.id}`} style={{ padding: "15px 18px", borderTop: `1px solid ${BORD}`, background: rowBg, transition: "background 0.3s" }}>
        {problemCell}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
          {resourceEl}{solveEl}{solutionEl}
          <div style={{ flex: 1 }} />
          {statusBtn}
        </div>
      </div>
    );
  }

  return (
    <div id={`prob-${p.id}`}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: "grid", gridTemplateColumns: "1fr 96px 104px 112px 92px", gap: "10px", padding: "13px 24px", borderTop: `1px solid ${BORD}`, alignItems: "center", background: rowBg, transition: "background 0.2s" }}>
      {problemCell}
      <div style={{ display: "flex", justifyContent: "center" }}>{resourceEl}</div>
      <div style={{ display: "flex", justifyContent: "center" }}>{solveEl}</div>
      <div style={{ display: "flex", justifyContent: "center" }}>{solutionEl}</div>
      <div style={{ display: "flex", justifyContent: "center" }}>{statusBtn}</div>
    </div>
  );
}

// ─── Solution modal (gated) ────────────────────────────────────────────────────
function SolutionModal({
  state, quotaLeft, copied, onClose, onConfirm, onCopy,
}: {
  state: NonNullable<SolModal>; quotaLeft: number; copied: boolean;
  onClose: () => void; onConfirm: () => void; onCopy: () => void;
}) {
  const { problem, stage } = state;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: stage === "view" ? "640px" : "440px", background: SURF, border: `1px solid ${BORD}`, borderRadius: "16px", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>

        {stage === "confirm" && (
          <div style={{ padding: "26px 24px", textAlign: "center" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: `${Y}1A`, border: `1px solid ${Y}55`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <AlertTriangle size={24} color={Y} />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 800, color: TXT, margin: "0 0 8px" }}>Are you sure you want the answer?</h3>
            <p style={{ fontSize: "13px", color: MUTE, lineHeight: 1.65, margin: "0 0 6px" }}>
              I know it's hard — but struggling with it first is exactly what makes it stick. Give it one more honest try before you peek.
            </p>
            <p style={{ fontSize: "12px", color: Y, fontWeight: 700, ...MONO, margin: "0 0 20px" }}>
              {quotaLeft} of {DAILY_SOLUTION_LIMIT} unlocks left today
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={onClose} style={{ flex: 1, padding: "11px", background: SURF2, border: `1px solid ${BORD}`, borderRadius: "10px", color: TXT, fontSize: "13px", fontWeight: 700, cursor: "pointer", ...SANS }}>
                I'll keep trying
              </button>
              <button onClick={onConfirm} style={{ flex: 1, padding: "11px", background: Y, border: "none", borderRadius: "10px", color: BG, fontSize: "13px", fontWeight: 800, cursor: "pointer", ...SANS }}>
                Reveal solution
              </button>
            </div>
          </div>
        )}

        {stage === "limit" && (
          <div style={{ padding: "26px 24px", textAlign: "center" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: `${HARD}1A`, border: `1px solid ${HARD}55`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Lock size={22} color={HARD} />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 800, color: TXT, margin: "0 0 8px" }}>Daily limit reached</h3>
            <p style={{ fontSize: "13px", color: MUTE, lineHeight: 1.65, margin: "0 0 20px" }}>
              You've unlocked {DAILY_SOLUTION_LIMIT} solutions today. That's the cap — keep grinding the rest on your own and come back tomorrow for more.
            </p>
            <button onClick={onClose} style={{ width: "100%", padding: "11px", background: SURF2, border: `1px solid ${BORD}`, borderRadius: "10px", color: TXT, fontSize: "13px", fontWeight: 700, cursor: "pointer", ...SANS }}>
              Got it
            </button>
          </div>
        )}

        {stage === "view" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: `1px solid ${BORD}` }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: "10px", color: MUTE, letterSpacing: "0.1em", ...MONO }}>SOLUTION · PYTHON</div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: TXT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{problem.title}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                <button onClick={onCopy} style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "7px 11px", background: copied ? `${EASY}1A` : SURF2, border: `1px solid ${copied ? EASY : BORD}`, borderRadius: "8px", color: copied ? EASY : MUTE, fontSize: "11px", fontWeight: 700, cursor: "pointer", ...MONO }}>
                  {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "COPIED" : "COPY"}
                </button>
                <button onClick={onClose} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "30px", height: "30px", background: "transparent", border: `1px solid ${BORD}`, borderRadius: "8px", color: MUTE, cursor: "pointer" }}>
                  <X size={14} />
                </button>
              </div>
            </div>
            <pre style={{ margin: 0, padding: "18px 20px", background: "#0E1014", color: "#E6E8EB", fontSize: "12.5px", lineHeight: 1.65, ...MONO, overflowX: "auto", maxHeight: "60vh" }}>
              <code>{problem.solution}</code>
            </pre>
            {problem.solveUrl && (
              <div style={{ padding: "12px 18px", borderTop: `1px solid ${BORD}`, display: "flex", justifyContent: "flex-end" }}>
                <a href={problem.solveUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: Y, textDecoration: "none", ...MONO }}>
                  TRY IT YOURSELF <ExternalLink size={12} />
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UpstridesSheet;
