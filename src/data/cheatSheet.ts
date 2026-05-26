// ─── Cheat-sheet content model ────────────────────────────────────────────────
// Beginner-friendly reference for the Upstrides Sheet. Two sheets: Python & DSA.
// Animations are rendered by CheatSheet.tsx from the `anim` block name.

export type AnimName =
  | "bigo" | "stack" | "queue" | "deque" | "linkedlist"
  | "binarysearch" | "tree" | "recursion" | "hash";

export type Block =
  | { k: "p"; t: string }
  | { k: "code"; t: string }
  | { k: "list"; items: string[] }
  | { k: "table"; head: string[]; rows: string[][] }
  | { k: "note"; t: string }
  | { k: "anim"; name: AnimName };

export interface Section { id: string; title: string; blocks: Block[]; }
export interface Sheet { key: "python" | "dsa"; label: string; blurb: string; sections: Section[]; }

// ═══════════════════════════════════════════════════════════════════════════
//  FOUNDATIONS — shared "before you start" block (added to both sheets)
// ═══════════════════════════════════════════════════════════════════════════
const FOUNDATIONS: Section[] = [
  {
    id: "time-complexity",
    title: "Time Complexity (Big-O)",
    blocks: [
      { k: "p", t: "Time complexity answers: \"as my input grows, how much SLOWER does my code get?\" We don't count seconds (that depends on the machine) — we count how the number of steps grows with the input size n. We write it with Big-O notation." },
      { k: "p", t: "Rule of thumb: drop constants and keep the biggest term. 3n + 5 becomes O(n). A loop inside a loop over n items is O(n²)." },
      { k: "anim", name: "bigo" },
      { k: "table", head: ["Big-O", "Name", "Feels like", "Example"], rows: [
        ["O(1)", "Constant", "Instant, no matter the size", "arr[5], dict lookup"],
        ["O(log n)", "Logarithmic", "Halves the work each step", "Binary search"],
        ["O(n)", "Linear", "Touch each item once", "A single for-loop"],
        ["O(n log n)", "Linearithmic", "Best for sorting", "Merge / Quick sort"],
        ["O(n²)", "Quadratic", "Slow — nested loops", "Bubble / Selection sort"],
        ["O(2ⁿ)", "Exponential", "Avoid — explodes fast", "Naive recursion (Fibonacci)"],
      ] },
      { k: "note", t: "Faster → slower:  O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!)" },
    ],
  },
  {
    id: "space-complexity",
    title: "Space Complexity",
    blocks: [
      { k: "p", t: "Space complexity measures the EXTRA memory your algorithm needs as the input grows — not the input itself, but the temporary stuff you create (arrays, recursion call-stack, hash maps)." },
      { k: "list", items: [
        "O(1) — you use a fixed handful of variables (e.g. two pointers). Best.",
        "O(n) — you build a new list/set/dict the size of the input.",
        "Recursion adds hidden space: each call sits on the call-stack until it returns, so depth-d recursion is O(d) space.",
      ] },
      { k: "note", t: "There's often a time–space trade-off: caching results (more memory) to run faster, or recomputing (less memory) to save space." },
    ],
  },
  {
    id: "data-types",
    title: "Data Types You'll Use",
    blocks: [
      { k: "p", t: "Data is stored in different \"shapes\". Pick the one that matches what you need to do. In Python the core ones are:" },
      { k: "table", head: ["Type", "What it holds", "Example", "Mutable?"], rows: [
        ["int", "Whole numbers", "42, -7", "—"],
        ["float", "Decimals", "3.14", "—"],
        ["str", "Text", "\"hello\"", "No"],
        ["bool", "True / False", "True", "—"],
        ["list", "Ordered, changeable sequence", "[1, 2, 3]", "Yes"],
        ["tuple", "Ordered, fixed sequence", "(1, 2)", "No"],
        ["dict", "Key → value pairs", "{\"a\": 1}", "Yes"],
        ["set", "Unique, unordered items", "{1, 2, 3}", "Yes"],
      ] },
      { k: "note", t: "Mutable = you can change it after creating it. Strings and tuples are immutable — \"editing\" them actually makes a new object." },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
//  PYTHON CHEAT SHEET
// ═══════════════════════════════════════════════════════════════════════════
const PYTHON_SECTIONS: Section[] = [
  {
    id: "py-basics", title: "Python Basics",
    blocks: [
      { k: "p", t: "Python runs top to bottom. No semicolons, no curly braces — indentation (4 spaces) defines blocks. Variables are created the moment you assign to them." },
      { k: "code", t: `name = "Alice"      # str
age = 21             # int
height = 5.6         # float
is_student = True    # bool

print(f"{name} is {age}")   # f-string formatting
x, y = 1, 2                 # multiple assignment
x, y = y, x                 # swap in one line` },
      { k: "note", t: "Comments start with #. Use snake_case for variables and functions." },
    ],
  },
  {
    id: "py-operators", title: "Operators in Python",
    blocks: [
      { k: "p", t: "Operators do the math and the comparisons that drive your logic." },
      { k: "code", t: `# Arithmetic
7 + 2   # 9     addition
7 - 2   # 5     subtraction
7 * 2   # 14    multiply
7 / 2   # 3.5   true divide (float)
7 // 2  # 3     floor divide (int)
7 % 2   # 1     remainder (modulo)
7 ** 2  # 49    power

# Comparison  -> give True/False
a == b, a != b, a < b, a >= b

# Logical
True and False   # False
True or False    # True
not True         # False` },
      { k: "note", t: "% (modulo) is everywhere in DSA — even/odd checks, wrap-arounds, hashing." },
    ],
  },
  {
    id: "py-controlflow", title: "Control Flow",
    blocks: [
      { k: "p", t: "Control flow decides WHICH code runs and HOW MANY times. if/elif/else branch; for/while repeat." },
      { k: "code", t: `# if / elif / else
if score >= 90:
    grade = "A"
elif score >= 75:
    grade = "B"
else:
    grade = "C"

# for loop over a range
for i in range(5):        # 0,1,2,3,4
    print(i)

# for loop over a list
for item in [10, 20, 30]:
    print(item)

# while loop
n = 5
while n > 0:
    n -= 1

# break stops the loop, continue skips to next
for x in nums:
    if x == target:
        break` },
    ],
  },
  {
    id: "py-functions", title: "Python Functions",
    blocks: [
      { k: "p", t: "A function is a reusable block of code. Define with def, call by name. They keep code DRY (Don't Repeat Yourself)." },
      { k: "code", t: `def greet(name, greeting="Hi"):   # default argument
    return f"{greeting}, {name}!"

greet("Sam")               # "Hi, Sam!"
greet("Sam", "Hello")      # "Hello, Sam!"

# *args = many positional, **kwargs = many named
def total(*nums):
    return sum(nums)

# lambda = tiny anonymous function
square = lambda x: x * x` },
      { k: "note", t: "Arguments are passed by reference for mutable types (lists/dicts) — changes inside the function can affect the original." },
    ],
  },
  {
    id: "py-ds", title: "Data Structures in Python",
    blocks: [
      { k: "p", t: "The four built-in containers — knowing when to use each is half of DSA." },
      { k: "code", t: `# LIST — ordered, changeable
nums = [3, 1, 2]
nums.append(4)      # add to end
nums.pop()          # remove from end
nums.sort()         # in-place sort
nums[0], nums[-1]   # first, last

# TUPLE — ordered, fixed
point = (4, 5)

# DICT — key:value, O(1) lookup
ages = {"sam": 21}
ages["alex"] = 19
ages.get("sam", 0)  # safe lookup

# SET — unique items, O(1) "in"
seen = {1, 2, 3}
seen.add(4)
2 in seen           # True` },
      { k: "table", head: ["Operation", "list", "dict / set"], rows: [
        ["Lookup by key/index", "O(1) index / O(n) value", "O(1)"],
        ["Insert at end / add", "O(1)", "O(1)"],
        ["Search for a value", "O(n)", "O(1)"],
      ] },
    ],
  },
  {
    id: "py-builtins", title: "Built-In Functions",
    blocks: [
      { k: "p", t: "Python ships with helpers you'll reach for constantly. Don't reinvent them." },
      { k: "code", t: `len(x)            # length
sum(nums)         # total
min(nums), max(nums)
sorted(nums)      # returns a NEW sorted list
reversed(nums)
abs(-5)           # 5
range(0, 10, 2)   # 0,2,4,6,8
enumerate(lst)    # (index, value) pairs
zip(a, b)         # pair two lists
map(fn, lst)      # apply fn to each
filter(fn, lst)   # keep where fn is True
any(flags), all(flags)
int("42"), str(42), list("abc")` },
    ],
  },
  {
    id: "py-oops", title: "OOPs Concepts",
    blocks: [
      { k: "p", t: "Object-Oriented Programming bundles data + behaviour into objects. A class is the blueprint; an object is one built from it. Four pillars: Encapsulation, Inheritance, Polymorphism, Abstraction." },
      { k: "code", t: `class Animal:
    def __init__(self, name):   # constructor
        self.name = name        # attribute

    def speak(self):            # method
        return "..."

class Dog(Animal):              # inheritance
    def speak(self):            # polymorphism (override)
        return "Woof!"

d = Dog("Rex")
d.speak()      # "Woof!"
d.name         # "Rex"` },
      { k: "note", t: "self refers to the current object. __init__ runs automatically when you create an object." },
    ],
  },
  {
    id: "py-regex", title: "RegEx (Pattern Matching)",
    blocks: [
      { k: "p", t: "Regular expressions search/validate text by pattern. Use the re module." },
      { k: "code", t: `import re

re.search(r"\\d+", "abc123")   # finds "123"
re.findall(r"\\w+", "a b c")   # ['a','b','c']
re.match(r"^[A-Za-z]", text)   # match at start
re.sub(r"\\s+", "_", "a b")    # "a_b"

# Common tokens:
# \\d digit   \\w word char   \\s space
# +  one+     *  zero+        ?  optional
# ^  start    $  end          [] set` },
    ],
  },
  {
    id: "py-exceptions", title: "Exception Handling",
    blocks: [
      { k: "p", t: "Errors (exceptions) crash your program unless you catch them. try/except lets you handle them gracefully." },
      { k: "code", t: `try:
    x = int(input())
    result = 10 / x
except ZeroDivisionError:
    print("can't divide by zero")
except ValueError:
    print("not a number")
else:
    print("worked:", result)   # runs if no error
finally:
    print("always runs")` },
      { k: "note", t: "Catch specific errors, not a bare 'except:' — otherwise you hide real bugs." },
    ],
  },
  {
    id: "py-debug", title: "Debugging in Python",
    blocks: [
      { k: "p", t: "When code misbehaves, look — don't guess. Fastest tools first." },
      { k: "list", items: [
        "print() the variable right before it goes wrong — the classic.",
        "Use a real debugger: import pdb; pdb.set_trace() (or breakpoint()) pauses execution so you can inspect.",
        "Read the traceback bottom-up: the last line is the actual error and the line number.",
        "Rubber-duck it: explain the code line by line out loud — you'll spot the bug.",
      ] },
      { k: "code", t: `def buggy(nums):
    breakpoint()        # pauses here in terminal
    return sum(nums) / len(nums)` },
    ],
  },
  {
    id: "py-files", title: "File Handling",
    blocks: [
      { k: "p", t: "Read and write files with open(). Always use 'with' — it closes the file for you, even on error." },
      { k: "code", t: `# Write
with open("data.txt", "w") as f:
    f.write("hello")

# Read whole file
with open("data.txt", "r") as f:
    text = f.read()

# Read line by line (memory-friendly)
with open("data.txt") as f:
    for line in f:
        print(line.strip())

# Modes: 'r' read, 'w' overwrite, 'a' append` },
    ],
  },
  {
    id: "py-memory", title: "Memory Management",
    blocks: [
      { k: "p", t: "Python manages memory for you. Two ideas worth knowing:" },
      { k: "list", items: [
        "Reference counting: every object tracks how many names point to it. When that hits zero, the memory is freed.",
        "Garbage collector: cleans up reference cycles (objects pointing at each other) that counting alone can't catch.",
        "Names are references, not boxes: b = a makes both point to the SAME list — changing one changes the other.",
      ] },
      { k: "code", t: `a = [1, 2, 3]
b = a            # same object!
b.append(4)
print(a)         # [1, 2, 3, 4]  <- a changed too

c = a.copy()     # real separate copy` },
    ],
  },
  {
    id: "py-decorators", title: "Decorators",
    blocks: [
      { k: "p", t: "A decorator is a function that wraps another function to add behaviour (logging, timing, caching) WITHOUT changing its code. Marked with @." },
      { k: "code", t: `def timer(fn):
    import time
    def wrapper(*args, **kwargs):
        start = time.time()
        result = fn(*args, **kwargs)
        print("took", time.time() - start)
        return result
    return wrapper

@timer
def slow():
    ...

# @functools.lru_cache caches results = huge DSA speedup
from functools import lru_cache
@lru_cache
def fib(n):
    return n if n < 2 else fib(n-1) + fib(n-2)` },
    ],
  },
  {
    id: "py-libs", title: "Libraries You'll Meet",
    blocks: [
      { k: "p", t: "Libraries are pre-written code you import to avoid building from scratch." },
      { k: "table", head: ["Library", "Use it for"], rows: [
        ["collections", "deque, Counter, defaultdict — DSA gold"],
        ["heapq", "Priority queue / min-heap"],
        ["math", "sqrt, gcd, inf, factorial"],
        ["itertools", "permutations, combinations, product"],
        ["bisect", "Binary-search insert into sorted list"],
        ["numpy / pandas", "Data science: arrays & tables"],
      ] },
      { k: "code", t: `from collections import deque, Counter
q = deque([1, 2, 3])     # fast pops from both ends
Counter("aab")           # {'a':2, 'b':1}

import heapq
heapq.heappush(h, 5)     # min-heap` },
    ],
  },
  {
    id: "py-modules", title: "Modules",
    blocks: [
      { k: "p", t: "A module is just a .py file you can import into another. It's how you split a big program into reusable pieces." },
      { k: "code", t: `# file: mathutils.py
def add(a, b):
    return a + b

# file: main.py
import mathutils
mathutils.add(2, 3)

from mathutils import add
add(2, 3)

# Only run when executed directly, not when imported:
if __name__ == "__main__":
    main()` },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
//  DSA CHEAT SHEET
// ═══════════════════════════════════════════════════════════════════════════
const DSA_SECTIONS: Section[] = [
  {
    id: "dsa-arrays", title: "Arrays",
    blocks: [
      { k: "p", t: "An array stores items back-to-back in memory, each at a numbered index starting from 0. Because the computer knows exactly where index i lives, reading any element is instant — O(1)." },
      { k: "p", t: "Low-level note: a true array has a FIXED size. Python's list is a \"dynamic array\" — when it fills up it quietly allocates a bigger block and copies everything over. That copy is rare, so on average appending is still O(1) — this averaging trick is called amortization." },
      { k: "table", head: ["Operation", "Time"], rows: [
        ["Read / write arr[i]", "O(1)"],
        ["Append at end", "O(1) amortized"],
        ["Insert / delete in middle", "O(n) — shift everything"],
        ["Search (unsorted)", "O(n)"],
      ] },
    ],
  },
  {
    id: "dsa-stack", title: "Stacks (LIFO)",
    blocks: [
      { k: "p", t: "A stack is Last-In-First-Out — like a stack of plates: you add and remove from the TOP only. The last thing you pushed is the first thing you pop." },
      { k: "anim", name: "stack" },
      { k: "p", t: "Used for: undo/redo, browser back button, function call-stack, matching brackets, DFS." },
      { k: "code", t: `stack = []
stack.append(10)   # push  -> [10]
stack.append(20)   # push  -> [10, 20]
stack.pop()        # pop   -> returns 20
stack[-1]          # peek top without removing` },
      { k: "note", t: "push, pop, and peek are all O(1)." },
    ],
  },
  {
    id: "dsa-queue", title: "Queues (FIFO)",
    blocks: [
      { k: "p", t: "A queue is First-In-First-Out — like a line at a shop: people leave from the FRONT, new people join at the BACK. The first to arrive is the first served." },
      { k: "anim", name: "queue" },
      { k: "p", t: "Used for: task scheduling, printers, BFS (breadth-first search)." },
      { k: "code", t: `from collections import deque
q = deque()
q.append(1)        # enqueue at back
q.append(2)
q.popleft()        # dequeue from front -> 1` },
      { k: "note", t: "Use collections.deque, NOT a list — list.pop(0) is O(n), deque.popleft() is O(1)." },
    ],
  },
  {
    id: "dsa-deque", title: "Deques (Double-Ended)",
    blocks: [
      { k: "p", t: "A deque (\"deck\") lets you add and remove from BOTH ends in O(1). It's a queue and a stack at the same time." },
      { k: "anim", name: "deque" },
      { k: "code", t: `from collections import deque
d = deque([1, 2, 3])
d.appendleft(0)    # [0,1,2,3]
d.append(4)        # [0,1,2,3,4]
d.popleft()        # 0
d.pop()            # 4` },
      { k: "note", t: "Perfect for sliding-window problems." },
    ],
  },
  {
    id: "dsa-linkedlist", title: "Linked Lists",
    blocks: [
      { k: "p", t: "A linked list is a chain of nodes. Each node holds a value plus a pointer to the NEXT node. Unlike arrays they're not stored together in memory — you follow the pointers to walk the list." },
      { k: "anim", name: "linkedlist" },
      { k: "p", t: "Singly linked = pointers go one way (next). Doubly linked = each node also has a prev pointer, so you can walk backwards too." },
      { k: "table", head: ["Operation", "Linked List", "Array"], rows: [
        ["Insert/delete at head", "O(1)", "O(n)"],
        ["Access by index", "O(n)", "O(1)"],
        ["Search", "O(n)", "O(n)"],
      ] },
      { k: "code", t: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

# 1 -> 2 -> 3
a = Node(1); a.next = Node(2); a.next.next = Node(3)` },
    ],
  },
  {
    id: "dsa-recursion", title: "Recursion & Memoization",
    blocks: [
      { k: "p", t: "Recursion is a function that calls ITSELF on a smaller version of the problem, until it hits a base case that stops the chain. Every call waits on the call-stack until the deeper calls finish." },
      { k: "anim", name: "recursion" },
      { k: "p", t: "Two must-haves: (1) a base case to stop, (2) progress toward it. Forget either and you get infinite recursion / stack overflow." },
      { k: "code", t: `def factorial(n):
    if n <= 1:          # base case
        return 1
    return n * factorial(n - 1)   # smaller problem` },
      { k: "p", t: "Memoization = remember answers you've already computed so you don't redo them. It turns slow exponential recursion into fast linear time." },
      { k: "code", t: `from functools import lru_cache
@lru_cache
def fib(n):
    if n < 2: return n
    return fib(n-1) + fib(n-2)   # O(2^n) -> O(n) with cache` },
    ],
  },
  {
    id: "dsa-trees", title: "Trees & BST",
    blocks: [
      { k: "p", t: "A tree is a hierarchy: one root at top, each node has children below it, no cycles. A Binary Tree limits each node to at most 2 children (left, right)." },
      { k: "anim", name: "tree" },
      { k: "p", t: "A Binary Search Tree (BST) keeps order: everything in the LEFT subtree is smaller, everything in the RIGHT is bigger. That lets you search in O(log n) when balanced — like binary search, but on a tree." },
      { k: "p", t: "Traversals = the order you visit nodes. Inorder on a BST gives sorted values." },
      { k: "code", t: `class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def inorder(node):          # Left, Root, Right
    if not node: return
    inorder(node.left)
    print(node.val)
    inorder(node.right)
# Preorder = Root,L,R   Postorder = L,R,Root` },
      { k: "note", t: "Common tree questions: height/depth, balanced check, lowest common ancestor, level-order (BFS with a queue)." },
    ],
  },
  {
    id: "dsa-heap", title: "Heaps & Priority Queues",
    blocks: [
      { k: "p", t: "A heap is a special binary tree where the parent is always smaller (min-heap) or bigger (max-heap) than its children. So the smallest/biggest item is always at the top — grab it in O(1), and re-balance in O(log n)." },
      { k: "p", t: "A Priority Queue is a queue where items come out by priority, not arrival order — heaps are how you build one. Inserting bubbles a value UP (percolate-up); removing the top sinks a value DOWN (percolate-down)." },
      { k: "code", t: `import heapq
h = []
heapq.heappush(h, 5)   # O(log n)
heapq.heappush(h, 1)
heapq.heappush(h, 3)
heapq.heappop(h)       # 1 (smallest)  O(log n)
h[0]                   # peek smallest O(1)

# max-heap trick: push negatives
heapq.heappush(h, -x)` },
    ],
  },
  {
    id: "dsa-searching", title: "Searching",
    blocks: [
      { k: "p", t: "Sequential (linear) search just checks every item one by one — O(n). It works on any list, sorted or not." },
      { k: "p", t: "Binary search is the superpower: on a SORTED list, check the middle, then throw away half the list each step. O(log n) — a million items take only ~20 checks." },
      { k: "anim", name: "binarysearch" },
      { k: "code", t: `def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1        # go right
        else:
            hi = mid - 1        # go left
    return -1` },
      { k: "note", t: "Binary search ONLY works on sorted data. Python's bisect module does it for you." },
    ],
  },
  {
    id: "dsa-hashing", title: "Hashing & Hash Tables",
    blocks: [
      { k: "p", t: "A hash table (Python's dict/set) turns a key into a number with a hash function, and uses that number as an index to jump straight to the value — so lookup, insert, and delete are O(1) on average." },
      { k: "anim", name: "hash" },
      { k: "p", t: "When two keys hash to the same slot it's a collision; the table handles it (e.g. chaining items in a bucket). Great hash functions spread keys evenly so collisions stay rare." },
      { k: "code", t: `seen = {}                  # dict as a hash table
seen["a"] = 1
"a" in seen                # O(1)

# Classic use: count / detect duplicates fast
from collections import Counter
Counter("banana")          # {'a':3,'b':1,'n':2}` },
    ],
  },
  {
    id: "dsa-sorting", title: "Sorting",
    blocks: [
      { k: "p", t: "Sorting puts items in order. You should know the simple O(n²) ones conceptually, and use the fast O(n log n) ones in practice." },
      { k: "table", head: ["Algorithm", "Time", "Idea"], rows: [
        ["Bubble Sort", "O(n²)", "Repeatedly swap adjacent out-of-order pairs; biggest 'bubbles' to the end."],
        ["Selection Sort", "O(n²)", "Find the smallest, put it first; repeat for the rest."],
        ["Insertion Sort", "O(n²)", "Build a sorted part one card at a time (like sorting a hand)."],
        ["Merge Sort", "O(n log n)", "Split in half, sort each, merge them back."],
        ["Quick Sort", "O(n log n) avg", "Pick a pivot, put smaller left / bigger right, recurse."],
      ] },
      { k: "code", t: `# Bubble sort — easy to understand, slow
def bubble(arr):
    n = len(arr)
    for i in range(n):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

# In real code, just use:
arr.sort()          # O(n log n), in place
sorted(arr)         # returns a new sorted list` },
    ],
  },
  {
    id: "dsa-dp", title: "Dynamic Programming (DP)",
    blocks: [
      { k: "p", t: "DP solves a big problem by breaking it into overlapping smaller problems and REUSING their answers instead of recomputing. Two signs a problem is DP: (1) optimal substructure — the best answer is built from best sub-answers, (2) overlapping subproblems — the same sub-answer is needed many times." },
      { k: "list", items: [
        "Top-down (memoization): write the recursion, then cache results with @lru_cache.",
        "Bottom-up (tabulation): fill a table from the smallest cases up to the answer.",
        "Classics: Fibonacci, climbing stairs, coin change, longest common subsequence, knapsack.",
      ] },
      { k: "code", t: `# Climbing stairs: how many ways to reach step n (1 or 2 at a time)
def climb(n):
    dp = [0] * (n + 1)
    dp[0] = dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]` },
    ],
  },
  {
    id: "dsa-graphs", title: "Graphs",
    blocks: [
      { k: "p", t: "A graph is nodes (vertices) connected by edges — think cities joined by roads, or friends on a social network. Trees are just graphs with no cycles. Store them as an adjacency list: each node maps to its neighbours." },
      { k: "p", t: "Two ways to explore: BFS (breadth-first) uses a QUEUE and fans out level by level — great for shortest path in unweighted graphs. DFS (depth-first) uses a STACK or recursion and dives deep before backtracking." },
      { k: "code", t: `from collections import deque
graph = {0: [1, 2], 1: [3], 2: [3], 3: []}

def bfs(start):
    seen = {start}
    q = deque([start])
    while q:
        node = q.popleft()
        for nb in graph[node]:
            if nb not in seen:
                seen.add(nb)
                q.append(nb)

def dfs(node, seen=set()):
    seen.add(node)
    for nb in graph[node]:
        if nb not in seen:
            dfs(nb, seen)` },
      { k: "note", t: "Always track 'seen' nodes — otherwise cycles loop forever." },
    ],
  },
];

export const SHEETS: Record<"python" | "dsa", Sheet> = {
  python: {
    key: "python", label: "Python",
    blurb: "The language essentials — syntax, data, and the tools you'll use on every problem.",
    sections: [...FOUNDATIONS, ...PYTHON_SECTIONS],
  },
  dsa: {
    key: "dsa", label: "DSA",
    blurb: "Data structures & algorithms explained in plain English, with the complexities that matter.",
    sections: [...FOUNDATIONS, ...DSA_SECTIONS],
  },
};
