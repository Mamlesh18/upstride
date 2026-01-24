import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, User, ArrowRight, BookOpen } from "lucide-react";

const Blogs = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const blogPosts = [
    {
      id: 1,
      title: "How I Actually Cracked Campus Placements (Real Talk, No BS)",
      excerpt: "I was that average student with a 7.2 CGPA who thought placements were only for the toppers. Here's how I proved myself wrong and landed a job at a product-based company.",
      author: "Rahul Sharma",
      date: "December 28, 2024",
      readTime: "8 min read",
      image: "/placeholder-blog-1.jpg",
      content: `# How I Actually Cracked Campus Placements (Real Talk, No BS)

Let me be honest with you. Six months ago, I was scrolling through LinkedIn seeing everyone post their offer letters while I was sitting with a 7.2 CGPA thinking "placements are not for average students like me." Spoiler alert: I was completely wrong.

I'm writing this because I wish someone had told me these things earlier. Not the usual "work hard" advice, but the real, practical stuff that actually works.

## The Wake-Up Call

It was August 2024. Placements were starting in December. I had zero prep. My DSA was terrible - I could barely solve easy LeetCode problems. My resume? A one-page disaster with "participated in college fest" as an achievement.

Then I had a reality check. I saw my seniors who were "average" like me getting placed in companies like Zomato, Swiggy, and even Amazon. I asked one of them point-blank: "How did you do it?"

His answer changed everything: **"Bro, it's not about being the smartest. It's about being prepared and knowing how to sell your experience."**

## What Actually Worked for Me

### 1. I Stopped Lying on My Resume

This might sound weird, but hear me out. Earlier, my resume had all these fancy words about projects I barely understood. During one mock interview, I got exposed badly when they asked me to explain my "ML project."

So I completely rewrote my resume. Instead of:
- "Developed machine learning model for prediction"

I wrote:
- "Built a simple price prediction tool using Python and linear regression. Learned how data cleaning affects accuracy."

Guess what? Interviewers loved the honesty. They could see I actually learned something, even if it wasn't rocket science.

### 2. The 6-Day Loop That Changed My DSA Game

I found this approach on Reddit and it literally saved me. Instead of randomly solving problems, I followed this pattern:

**Day 1:** Learn ONE topic (like Binary Search). Watch one good YouTube video, take notes.
**Day 2:** Solve 5-6 easy problems on that topic. Get comfortable.
**Day 3:** Tackle 3-4 medium problems. Time yourself - 30-40 minutes per problem.
**Day 4:** Mix it up - combine two topics you've learned.
**Day 5:** Go back and solve Day 2 problems again WITHOUT looking at solutions.
**Day 6:** Do a mock interview with a friend. Explain your approach out loud.

In 8 weeks, I went from struggling with arrays to solving medium-level tree and graph problems. Did 200+ problems total.

### 3. LinkedIn Is Your Resume's Best Friend

I was that guy who had LinkedIn just because everyone else did. Big mistake.

Here's what I did differently:
- Posted about my learning journey every week. Even small wins like "Finally understood how binary trees work!"
- Shared my project failures (yes, failures). People actually engage more with honest content.
- Reached out to seniors and asked for advice. Most people are actually helpful if you're respectful.

One of my LinkedIn posts got noticed by a recruiter. That's how I got an off-campus interview at a startup that eventually gave me an offer.

### 4. Mock Interviews Are Everything

I did 20+ mock interviews with my college friends. We'd take turns interviewing each other every Saturday. Felt awkward at first, but it helped SO MUCH.

Why? Because when the real interview happened, I wasn't nervous. I'd already explained my projects 20 times. The behavioral questions? Already practiced with my friends.

## The Interview Process (What Actually Happens)

Let me break down what really happens in campus placements:

**Round 1 - Online Test:**
Usually 2-3 coding questions + aptitude. Focus on solving at least 1 completely rather than attempting all partially.

**Round 2 - Technical:**
They'll ask about your projects. Pro tip: Pick ONE project you know inside-out. They'll definitely ask you to explain it in detail.

**Round 3 - HR/Behavioral:**
STAR method saved me here (Situation, Task, Action, Result). Every answer followed this structure.

Common questions I got:
- "Tell me about a time you failed" - I talked about my first hackathon disaster and what I learned
- "Why our company?" - I researched their recent product launches and mentioned specific features I liked

## Mistakes I Made (So You Don't Have To)

**❌ Jumping to Hard Problems Too Soon**
I wasted 2 weeks trying to solve hard DP problems when I couldn't even do medium arrays. Start with easy, build confidence.

**❌ Ignoring Communication Skills**
Even if you solve the problem, if you can't explain it properly, you'll struggle. Practice explaining your code to non-technical friends.

**❌ Comparing Myself to Others**
My roommate was solving 5 problems a day while I did 2-3. I felt bad. But everyone's pace is different. Focus on YOUR progress.

**❌ Not Taking Care of My Health**
I burned out in Week 5 because I was coding 8 hours straight. Sleep matters. Exercise matters. Your brain needs rest.

## The Numbers Game (Reality Check)

Here's what my final stats looked like:
- **Applications sent:** 40+ companies
- **Online tests given:** 25
- **Technical interviews:** 8
- **Final offers:** 3
- **Rejections:** 22 (yes, this is normal!)

Got rejected by TCS in aptitude round. Got rejected by Amazon in technical round. But got offers from a good product-based company (9 LPA), a startup (8.5 LPA), and Cognizant (4.5 LPA).

## My Honest Advice to You

1. **Start NOW.** Even if placements are 6 months away. That's enough time.

2. **Be consistent over being intense.** 3 hours daily is better than 12 hours on weekends.

3. **Build ONE good project.** Make it work properly. Deploy it. Use it yourself. That's better than 5 half-done projects.

4. **Your CGPA matters, but it's not everything.** I had 7.2. I know people with 6.8 who got placed in Amazon. Skills + preparation + communication can compensate.

5. **Service-based companies are NOT bad.** My friend joined TCS, learned a lot, and switched to Microsoft after 2 years. It's a journey, not a destination.

## Final Thoughts

Look, I'm not going to lie and say it was easy. There were days I wanted to give up. Days when I thought I'm not good enough. But I kept showing up.

The campus placement process isn't about being the smartest person in the room. It's about being prepared, being honest about your skills, and being able to communicate what you know.

You don't need to be a 9-pointer to get placed. You don't need to solve 1000 LeetCode problems. You need strategy, consistency, and the right approach.

If an average student like me with 7.2 CGPA could do it, you definitely can.

All the best! Feel free to reach out if you have questions. We're all in this together.

---

**Want structured guidance for your placement preparation?** Check out UPSTRIDE's Experience Selling Bootcamp where we teach you exactly these strategies with personalized mentorship.
      `.trim(),
    },
    {
      id: 2,
      title: "Service vs Product Companies: What Nobody Tells You (My 2-Year Journey)",
      excerpt: "Started at TCS, now at a product startup. Here's the brutally honest truth about both worlds that your seniors won't tell you.",
      author: "Priya Mehta",
      date: "December 25, 2024",
      readTime: "10 min read",
      image: "/placeholder-blog-2.jpg",
      content: `# Service vs Product Companies: What Nobody Tells You (My 2-Year Journey)

Two years ago, I joined TCS as a fresher with a 3.6 LPA package. Last month, I joined a product-based startup at 12 LPA.

Everyone asks me: "Should I join service-based or product-based companies?"

Here's my honest answer: **It depends on where YOU are in your journey.**

Let me explain what I mean by sharing my real experience in both worlds.

## My TCS Story (The Reality)

**Package:** 3.6 LPA (yeah, not the 7 LPA they advertise)
**First project:** Banking domain, maintaining legacy code
**Tech stack:** Java Spring Boot (but mostly fixing bugs in 10-year-old code)

### What They Don't Tell You About Service Companies

**The Good Stuff (Actually Good):**

1. **Work-Life Balance Is Real**
I logged off at 6 PM every day. No weekend work unless there was a production issue (happened maybe 3-4 times in 2 years). My friends in startups were working till 11 PM regularly.

2. **Training Is Structured**
First 3 months was proper training. They taught me Java, SQL, basics of software development. For someone from a tier-3 college like me, this was gold.

3. **Job Security**
Literally no one gets fired unless you really mess up. I saw people who barely worked still getting their salary every month. (Not proud of it, but it's true)

4. **Time to Learn**
Between projects, I had A LOT of free time. I used it to learn React, built side projects, prepared for product-based interviews. Some people wasted it watching Netflix.

**The Hard Truth (Nobody Talks About This):**

1. **The Work Is... Boring**
90% of my time was spent fixing bugs in code I didn't write, adding small features, and attending meetings that could have been emails.

2. **Salary Growth Is SLOW**
After 2 years, my package was 4.2 LPA. That's 0.6 LPA increment in 2 years. My friend who joined a startup at 8 LPA is now at 15 LPA.

3. **You're a Number, Not a Name**
My team had 50 people. My manager changed 3 times in 2 years. Nobody really cared about my career growth.

4. **Tech Skills Can Stagnate**
I know people who worked for 4 years and still can't solve a medium LeetCode problem. The work doesn't challenge you technically.

## My Product Company Story (Current Reality)

**Package:** 12 LPA
**Role:** Full-stack developer at a fintech startup
**Tech stack:** React, Node.js, MongoDB, AWS

### What They Don't Tell You About Product Companies

**The Amazing Parts:**

1. **You Actually Build Things**
In 6 months here, I've built 3 complete features that real users are using. At TCS, I spent 2 years maintaining one module.

2. **Learning Is Fast**
I learned more in 6 months here than 2 years at TCS. Why? Because you HAVE to learn. The work demands it.

3. **Your Work Matters**
Last month, I fixed a bug that was affecting 10,000 users. I could see the impact immediately. That feeling is unmatched.

4. **Better Money**
12 LPA vs 4.2 LPA. Do the math. Plus, I got stock options (ESOPs) which could be worth lakhs if the company does well.

**The Brutal Reality (Be Prepared):**

1. **Work-Life Balance? What's That?**
I work 9-10 hours daily on average. Some weeks during product launches, it's 12-14 hours. Weekends? Sometimes yes.

2. **Performance Pressure Is REAL**
Every quarter, we have performance reviews. If you're not performing, you're out. I've seen 3 people get fired in 6 months.

3. **Imposter Syndrome Hits Hard**
Everyone around me is super smart. Sometimes I feel like I don't belong. It's mentally exhausting.

4. **Job Security Is Low**
My startup had a funding crunch last month. 10 people were laid off. I could be next. That fear is always there.

## The Interview Process Difference (Super Important)

This is what nobody talks about. The interview difficulty is VERY different.

**TCS Interview (My Experience):**
- **Round 1:** Aptitude test (basic math, logical reasoning)
- **Round 2:** Coding (2 easy problems - array manipulation, string reversal)
- **Round 3:** HR (mostly about communication skills)
- **Difficulty:** Easy to Medium

**Startup Interview (What I Faced):**
- **Round 1:** Online coding (2 medium-hard DSA problems in 90 minutes)
- **Round 2:** Technical deep-dive (1 hour of grilling about my projects)
- **Round 3:** System design (design a URL shortener)
- **Round 4:** Cultural fit + behavioral
- **Difficulty:** Hard to Very Hard

The skill gap is HUGE. I spent 4 months preparing specifically for product-based interviews after my TCS experience.

## So, Which One Should You Choose?

Here's my framework:

### Choose Service-Based If:

✅ Your DSA skills are weak (can't solve medium problems consistently)
✅ You need time to learn and upskill
✅ You value work-life balance over fast growth
✅ You want job security
✅ Your CGPA is below 7 (most product companies have cutoffs)
✅ You're from tier-2/tier-3 college (easier to get in)

**Strategy:** Join a service company, work 9-6, use evenings to upskill, switch to product after 1-2 years.

### Choose Product-Based If:

✅ Your DSA is strong (can solve medium-hard problems)
✅ You want rapid skill development
✅ You can handle pressure and uncertainty
✅ You want higher salary and faster growth
✅ You have good projects to show
✅ You're okay with longer working hours

**Reality Check:** Only 10-15% of freshers get into product companies. It's highly competitive.

## My Honest Recommendation

**For Most People:** Start with a good service-based company.

Why? Because:
1. You'll get industry exposure
2. You'll have time to learn new skills
3. You'll build real projects in free time
4. You'll prepare for product-based interviews properly
5. After 1-2 years, you can switch with better preparation

**The Transition Path I Followed:**

**Year 1 at TCS:**
- Learned the job basics
- Built 3 side projects in React
- Started solving DSA regularly
- Got comfortable with coding interviews

**Year 2 at TCS:**
- Solved 300+ LeetCode problems
- Contributed to open source
- Built one impressive full-stack project
- Started interviewing at product companies

**Month 25:**
- Got offer from startup
- Made the switch

## Common Myths I Want to Bust

**Myth 1: "Service companies don't teach you anything"**
FALSE. You learn professional behavior, teamwork, how corporates work. These are valuable skills.

**Myth 2: "Product companies are always better"**
FALSE. Many startups have toxic culture, terrible work-life balance, and shut down overnight.

**Myth 3: "You can't switch from service to product"**
FALSE. I did it. So did 10+ people I know. It's about YOUR effort, not your first company.

**Myth 4: "TCS is bad"**
FALSE. TCS gave me a job when I was a nobody. It paid my bills. It gave me time to learn. I'm grateful.

## The Money Talk (Real Numbers)

Let me break down the finances:

**Service-Based Path (TCS):**
- Year 0: 3.6 LPA
- Year 1: 3.8 LPA
- Year 2: 4.2 LPA
- Total earned in 2 years: ~7.5 lakhs

**Direct Product-Based Path (If You Get In):**
- Year 0: 8-12 LPA
- Year 1: 10-15 LPA
- Year 2: 12-18 LPA
- Total earned in 2 years: ~18-25 lakhs

Yes, the money difference is huge. But ask yourself: "Am I ready for a product-based interview RIGHT NOW?"

If the answer is no, it's better to start somewhere than nowhere.

## What I'd Do Differently

If I could go back and advise my fresher self:

1. **I'd still join TCS** - It was the right choice for my skill level at that time
2. **I'd start LeetCode from Day 1** - Would have made the transition faster
3. **I'd build more projects** - Weekends were wasted
4. **I'd network more** - LinkedIn is powerful
5. **I'd ask for referrals earlier** - Don't be shy

## Final Real Talk

Here's the truth nobody tells you:

**Your first job doesn't define your career.**

I know people who started at Cognizant and are now at Google.
I know people who started at Infosys and are now running their own startups.
I know people who started at Wipro and switched to Amazon.

The starting point matters less than what you do after joining.

Service or product, both are stepping stones. Choose based on where YOU are right now, not where you want to be in 5 years.

And please, stop judging people based on their first company. The guy joining TCS today might be at Microsoft tomorrow.

---

**Want to prepare for both service and product-based companies?** UPSTRIDE's Experience Selling Bootcamp covers strategies for both paths with real interview experiences and placement guidance.

Sources consulted for this article:
- [Product vs Service-Based Company Guide 2026](https://digitaldefynd.com/IQ/product-vs-service-based-company/)
- [Medium: Difference Between Product & Service Companies](https://medium.com/@krishnakasireddy213/difference-between-a-product-service-based-company-9db44d2795a1)
- [Product vs Service-Based Companies 2026](https://faceprep.medium.com/product-based-vs-service-based-companies-which-one-should-you-choose-in-2026-6e0bef8c258f)
      `.trim(),
    },
    {
      id: 3,
      title: "8 Weeks to Placement Ready: The Roadmap I Wish I Had (No Fluff)",
      excerpt: "Went from can't-solve-arrays to getting-multiple-offers in 8 weeks. Here's the exact day-by-day plan that worked for me and 20+ friends.",
      author: "Aditya Kumar",
      date: "December 20, 2024",
      readTime: "12 min read",
      image: "/placeholder-blog-3.jpg",
      content: `# 8 Weeks to Placement Ready: The Roadmap I Wish I Had (No Fluff)

Eight weeks. That's all I had before placement season started.

I was that guy who attended DSA classes in second year and understood nothing. My LeetCode count? 12 easy problems. My GitHub? Empty. My LinkedIn? Didn't even have a profile picture.

Fast forward 8 weeks: I had 3 offers in hand. Not because I'm smart, but because I followed a system.

This is that exact system. Not some theoretical roadmap, but what actually worked for me and 20+ friends who followed this.

## Week 0: The Reality Check (Before You Start)

Before jumping in, I had to be honest with myself:

**My Starting Point:**
- Could barely solve easy array problems
- Didn't understand Big O notation
- Resume had no projects worth mentioning
- Couldn't explain my college mini-project

**My Goal:**
- Get comfortable with medium DSA problems
- Build one impressive project
- Polish resume and LinkedIn
- Be confident in mock interviews

**Time Available:**
- 3-4 hours daily (weekdays)
- 6-8 hours (weekends)

## The 6-Day Loop Framework

This changed everything. Instead of random practice, I followed this pattern every week:

**Day 1 (Monday): Learn**
Pick ONE topic. Watch one good tutorial. Take notes. Don't code yet.

**Day 2 (Tuesday): Easy Practice**
Solve 5-6 easy problems on that topic. Build muscle memory.

**Day 3 (Wednesday): Level Up**
Tackle 3-4 medium problems. Time yourself: 30-40 minutes each.

**Day 4 (Thursday): Mix It Up**
Solve problems combining this week's topic + last week's topic.

**Day 5 (Friday): Revision**
Solve Tuesday's problems again WITHOUT looking at solutions.

**Day 6 (Saturday): Mock Interview**
Do a 45-minute mock with a friend. Explain your approach out loud.

**Day 7 (Sunday): Rest/Buffer**
Catch up if behind, or review weak areas. Sometimes I just rested.

## Week 1-2: Foundation (Don't Skip This!)

**Topics:**
- Arrays and Strings
- Time & Space Complexity

**What I Actually Did:**

**Week 1: Arrays**
- Day 1: Learned about two-pointer technique, sliding window
- Days 2-3: Solved 15 easy array problems
- Days 4-5: Attempted 8 medium problems (struggled with 4, that's okay!)
- Day 6: Mock with my friend Rohan

**Week 2: Strings**
- Day 1: String manipulation patterns
- Days 2-3: 12 easy string problems
- Days 4-5: 6 medium (mixed strings + arrays)
- Day 6: Mock interview

**Problems Solved:** 40-45
**Feeling:** Still struggling, but seeing patterns

**Pro Tip I Learned:**
Don't just solve and move on. After solving, I'd:
1. Read others' solutions
2. Find a better approach
3. Code it again from scratch
4. Explain it to my roommate in simple words

## Week 3-4: Core DSA (This Is Where It Gets Real)

**Topics:**
- Linked Lists
- Stacks & Queues
- Binary Search

**Week 3: Linked Lists**

This was tough. I couldn't visualize linked lists at all. Here's what helped:
- Drew diagrams on paper for EVERY problem
- Used online visualizers (visualgo.net)
- Solved same problem multiple times over 3 days

**Problems:**
- Days 1-3: 10 easy linked list problems
- Days 4-5: 5 medium (reverse linked list, detect cycle, merge lists)
- Day 6: Mock interview with linked list focus

**Week 4: Stacks, Queues & Binary Search**

Binary search was a game-changer. Once you get it, so many problems become easy.

**The Pattern I Found:**
- If array is sorted → think binary search
- Need to find min/max → think stack/queue
- Need to process in order → think queue

**Problems Solved in Week 3-4:** 50
**Total So Far:** ~95

**Reality Check:**
I was still getting stuck. Some days I couldn't solve a single problem. That's NORMAL. Don't give up.

## Week 5-6: Advanced Topics (The Game Changers)

**Topics:**
- Binary Trees & BST
- Graph Algorithms (BFS/DFS)
- Dynamic Programming Basics

**Week 5: Trees**

Trees broke my brain initially. But once I understood recursion, it clicked.

**My Approach:**
- Spent 2 full days just understanding tree traversal (inorder, preorder, postorder)
- Drew every tree on paper
- Practiced same traversal problem 5 times until I could write it with eyes closed

**Key Problems:**
- Maximum depth of binary tree
- Validate BST
- Lowest common ancestor
- Level order traversal

**Problems:** 20-25 (quality over quantity here)

**Week 6: Graphs & DP Intro**

**Graphs:**
Learned BFS and DFS. That's it. Didn't overcomplicate.

**DP (Dynamic Programming):**
Honestly? I barely touched DP. Focused on understanding basic recursion + memoization.

**Problems I Actually Solved:**
- Islands problem (BFS/DFS practice)
- Shortest path in grid
- Fibonacci with memoization
- Climbing stairs
- Coin change (basic DP)

**Total Problems:** 25-30
**Running Total:** ~150 problems

## Week 7: Company-Specific Prep (The Secret Sauce)

This week, I stopped solving random problems. Instead:

**Monday-Wednesday: Target Company Research**

Made a list of 10 companies I wanted to join:
- Researched their interview process
- Found their commonly asked questions
- Made notes on their tech stack

**Where I Found This Info:**
- GeeksforGeeks company-specific sections
- Leetcode company tags (you need premium, I split with 3 friends)
- YouTube (search "[Company Name] interview experience")

**Thursday-Friday: Previous Year Questions**

Solved actual questions asked in previous years:
- TCS → Very easy, aptitude focus
- Amazon → Medium-hard arrays, strings, trees
- Microsoft → Trees, graphs, system design basics

**Saturday-Sunday: Domain Prep**

Some companies ask domain questions (OS, DBMS, Networks). I revised:
- OS: Processes, threads, deadlock
- DBMS: Normalization, joins, indexing
- Networks: TCP/IP, HTTP/HTTPS basics

**Honest Confession:**
I didn't go deep. Just covered basics that could be asked in interviews.

## Week 8: Final Sprint (Polish Everything)

**No New Topics.** Just refinement.

**Monday-Tuesday: Resume & LinkedIn**

**My Resume Strategy:**
- 1 page only
- Added my ONE good project prominently
- Used action verbs (Built, Developed, Implemented)
- Quantified results ("Reduced load time by 40%")

**LinkedIn:**
- Professional photo
- Detailed experience section
- Posted about my learning journey
- Reached out to 20 alumni for advice

**Wednesday-Friday: Mock Interviews**

Did 6 mock interviews this week:
- 2 with friends
- 2 with seniors
- 2 on Pramp (free mock interview platform)

**What I Practiced:**
- Coding problems while explaining approach
- Behavioral questions using STAR method
- Asking good questions at the end

**Saturday-Sunday: Revision + Rest**

Revised:
- Common patterns (two-pointer, sliding window, BFS/DFS)
- Time complexities
- My project in-depth (could explain every line)

Also, I RESTED. Watched a movie. Played games. Your brain needs a break.

## The Behavioral Interview Prep (Don't Ignore This!)

Technical skills get you in the room. Behavioral skills get you the offer.

**Questions I Prepared:**

1. **Tell me about yourself**
My answer (30 seconds):
"I'm Aditya, final year CS student. I love building web apps and solving problems through code. Recently built a project that helps students track their placement preparation. Passionate about learning and collaborating with teams."

2. **Why this company?**
Research their recent product launches. Mention specific features.

3. **Biggest failure?**
I talked about my first hackathon where our project didn't work. Focused on what I learned.

4. **Biggest achievement?**
Went from 12 LeetCode problems to 200+ in 8 weeks while maintaining CGPA.

**STAR Method Example:**

**Question:** Tell me about a challenging problem you solved.

**Situation:** During my project, the app was taking 5 seconds to load user data.

**Task:** I needed to optimize it to under 1 second.

**Action:** I analyzed the code, found redundant API calls, implemented caching, and optimized database queries.

**Result:** Reduced load time to 0.8 seconds. Users noticed and appreciated the speed.

## Resources I Actually Used (No Affiliates, Just Truth)

**For DSA:**
- **LeetCode:** Main practice platform (150 problems)
- **Striver's SDE Sheet:** Guided my topic selection
- **NeetCode:** For understanding approaches
- **TakeUForward YouTube:** Best explanations

**For Resume/LinkedIn:**
- **Canva:** Resume template
- **Grammarly:** Grammar check
- **ChatGPT:** Helped refine bullet points (I wrote, it polished)

**For Mock Interviews:**
- **Pramp:** Free mock interviews
- **Friends:** Most valuable resource

**Cost:** ₹0 (except LeetCode premium which I split)

## Mistakes I Made (Learn From These)

**❌ Tried to Solve Too Many Problems Initially**
Week 1, I attempted 60 problems. Retained nothing. Quality > Quantity.

**❌ Ignored Easy Problems**
Thought easy problems were waste of time. Wrong. They build confidence and patterns.

**❌ Didn't Track Progress**
Started tracking from Week 3. Wish I'd done it from Day 1. Made a simple spreadsheet.

**❌ Skipped Mock Interviews Initially**
Did first mock in Week 5. Should've started from Week 2.

**❌ Didn't Rest Enough**
Burned out in Week 4. Lost 3 days. Rest is productive.

## My Final Numbers (Reality Check)

**After 8 Weeks:**
- **Problems Solved:** 200+ (150 seriously, 50+ quick revision)
- **Topics Covered:** 8-10 core topics
- **Mock Interviews:** 12
- **Projects Built:** 1 solid project
- **Resume Versions:** 7 (kept improving)

**Placement Results:**
- **Applied:** 30+ companies
- **Online Tests:** 18
- **Technical Interviews:** 6
- **Final Offers:** 3
  - Product Startup: 9 LPA
  - Service Company: 4.5 LPA
  - Mid-sized Product: 7.5 LPA

## If I Had to Do It Again (Changes I'd Make)

1. **Start with EASY problems for longer** - Build confidence first
2. **Do mock interviews from Week 2** - Don't wait
3. **Build project in parallel** - I did it last minute
4. **Track everything** - Progress tracking keeps you motivated
5. **Join a study group** - Accountability matters

## The Honest Truth

This roadmap worked for me. But everyone's different.

**If you have 12 weeks:** Spend more time on each topic, solve more problems
**If you have 4 weeks:** Focus only on arrays, strings, trees, basic DP
**If your basics are strong:** Skip Week 1-2, jump to advanced topics

The key is **consistency**, not perfection.

## Your Action Plan (Start Tomorrow)

1. **Tonight:** Make a spreadsheet to track problems
2. **Tomorrow:** Solve your first easy array problem
3. **This Week:** Complete 10 easy array problems
4. **Follow the 6-day loop**
5. **Track and adjust**

Remember: Every expert was once a beginner who didn't quit.

---

**Need structured guidance for this 8-week journey?** Join UPSTRIDE's Experience Selling Bootcamp where we provide personalized mentorship, mock interviews, and proven frameworks to ace your placements.

Sources consulted for this article:
- [How I Prepared for Coding Interviews in 3 Months - Medium](https://medium.com/swlh/how-i-prepared-for-coding-interviews-in-3-months-8d54ba3bf50)
- [Roadmap for Learning DSA 2026](https://www.placementpreparation.io/blog/roadmap-for-learning-dsa/)
- [Tech Interview Handbook - Study Plan](https://www.techinterviewhandbook.org/coding-interview-study-plan/)
- [Google DS & Algo Roadmap 2026 - Medium](https://medium.com/@prashant558908/google-ds-algo-interview-preparation-roadmap-2026-974d15cb10cd)
      `.trim(),
    },
    {
      id: 4,
      title: "Why Students Feel Lost: The Missing Piece That Changes Everything",
      excerpt: "Most students aren't confused because they can't learn. They're confused because no one tells them where to start. Here's what nobody talks about.",
      author: "UPSTRIDE Team",
      date: "January 20, 2025",
      readTime: "6 min read",
      image: "/placeholder-blog-4.jpg",
      content: `# Why Students Feel Lost: The Missing Piece That Changes Everything

Most students aren't confused because they can't learn.
They're confused because no one tells them where to start.

The internet is full of courses, tutorials, and advice.
Yet so many students feel lost, anxious, and unsure about their future.

Not because knowledge is missing.
But because guidance is.

## The Information Overload Problem

I've seen students spend thousands, even lakhs, chasing courses — hoping one of them will finally give clarity.

Most of the time, they don't need more content.
They need someone to sit with them and say,
**"Here's the right path for you. Trust this."**

Think about it:
- YouTube has millions of tutorials
- Udemy has thousands of courses
- LinkedIn has endless "top 10 tips" posts
- Twitter/X is full of learning threads

And yet, students are more confused than ever.

**Why?**

Because having access to everything means knowing nothing about what matters for YOU.

## The Real Problem: Information vs Direction

There's a huge difference between:
- **Information:** "Here are 50 ways to learn Python"
- **Direction:** "Based on your goals, start with THIS, then do THAT"

Information is everywhere. Direction is rare.

A student told me recently: "I've started 12 courses in the last year. I've finished none. I don't know what's right for me."

That's not a discipline problem. That's a direction problem.

## Why One Mentor Changes Everything

One mentor.
One honest conversation.
One correction at the right time.

That's enough to change a life.

### What a Good Mentor Does:

**1. Cuts Through the Noise**
Instead of "learn everything," a mentor says: "For your goals, focus on these 3 things. Ignore the rest for now."

**2. Gives Personalized Paths**
Generic advice doesn't work. A mentor understands YOUR situation — your background, your strengths, your constraints — and creates a path that fits YOU.

**3. Provides Accountability**
It's easy to skip a YouTube tutorial. It's hard to skip a session with someone who's invested in your success.

**4. Shares Real Experience**
Courses teach theory. Mentors share what actually works in the real world — the shortcuts, the mistakes to avoid, the things that matter.

**5. Offers Emotional Support**
Sometimes you just need someone to say: "This is normal. Everyone struggles here. You're on the right track."

## Learning is Free. Direction is Priceless.

Learning is free today.
But mentorship gives hope, confidence, and direction.

And sometimes, that direction is all a student is really looking for.

You can watch 100 videos on "how to crack placements."
Or you can have one conversation with someone who's been there, who understands your specific situation, and who can tell you exactly what to do next.

## The Students Who Succeed

I've noticed a pattern in students who succeed:

They don't try to learn everything.
They find someone they trust.
They follow that guidance completely.
They ask questions when confused.
They stay consistent.

**That's it.**

The students who struggle:
- Jump from course to course
- Follow 10 different "gurus" with conflicting advice
- Never complete anything
- Feel paralyzed by too many options

## What You Actually Need

If you're feeling lost right now, here's what you need:

**1. ONE trusted source of guidance**
Not 10. Not 5. One person or program you trust completely.

**2. A clear, step-by-step path**
Not "learn everything eventually." A specific sequence: First this, then this, then this.

**3. Regular check-ins**
Someone to course-correct when you go off track.

**4. Permission to ignore everything else**
The freedom to say "no" to shiny new courses and stick with your plan.

## The Mentorship Mindset

Here's a shift in thinking that helped many students:

**Before:** "I need to learn more"
**After:** "I need to learn the right things in the right order"

**Before:** "I'm behind compared to others"
**After:** "I'm on my own timeline, and I have a clear path"

**Before:** "I should try everything"
**After:** "I should master what matters"

## A Simple Exercise

If you're reading this and feeling lost, try this:

1. **Write down your goal** (e.g., "Get placed in a product company in 6 months")
2. **Find ONE person** who has achieved that goal
3. **Ask them:** "If you were me, what would you do first?"
4. **Do exactly that.** Nothing else.

That simple act of getting direction from someone who's been there — that's mentorship.

## Why We Built UPSTRIDE

This is exactly why UPSTRIDE exists.

We're not selling courses. We're selling experience and direction.

Every student in our program gets:
- A clear, week-by-week roadmap
- Personal mentorship from people who've been there
- Honest feedback on what's working and what's not
- The confidence that comes from knowing you're on the right path

Because we believe what you need isn't more content.
You need someone to show you the way.

## Final Thoughts

If you take nothing else from this post, remember this:

**You're not lost because you can't learn.
You're lost because no one showed you where to start.**

Find that person. Find that guidance. Everything else becomes easier.

Learning is free.
But mentorship gives hope, confidence, and direction.

And sometimes, that direction is all you're really looking for.

---

**Ready to get the direction you need?** Join UPSTRIDE's Experience Selling Bootcamp — where we don't just teach skills, we guide you personally through your career journey.
      `.trim(),
    },
  ];

  // Find the current blog post if id is provided
  const currentBlog = id ? blogPosts.find(post => post.id === parseInt(id)) : null;

  // If viewing a single blog post
  if (currentBlog) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="fixed top-0 w-full backdrop-blur-sm z-40 border-b border-border/20">
          <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate("/")}>
              <img src="/upstride-logo.png" alt="UPSTRIDE Logo" className="h-10 w-10 object-contain" />
              <h1 className="text-2xl font-bold text-foreground">UPSTRIDE</h1>
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" onClick={() => navigate("/")}>
                Home
              </Button>
              <Button variant="ghost" onClick={() => navigate("/programs")}>
                Programs
              </Button>
              <Button variant="ghost" onClick={() => navigate("/blogs")}>
                Blogs
              </Button>
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Portal
              </Button>
            </div>
          </nav>
        </header>

        {/* Blog Detail Content */}
        <article className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <Button
              variant="ghost"
              onClick={() => navigate("/blogs")}
              className="mb-8 hover:translate-x-[-4px] transition-transform"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Blogs
            </Button>

            {/* Blog Header */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-black mb-4 text-foreground leading-tight">
                {currentBlog.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{currentBlog.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{currentBlog.date}</span>
                </div>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {currentBlog.readTime}
                </span>
              </div>

              {/* Featured Image Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-8">
                <BookOpen className="w-24 h-24 text-primary/40" />
              </div>
            </div>

            {/* Blog Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-foreground leading-relaxed whitespace-pre-line">
                {currentBlog.content.split('\n').map((line, index) => {
                  // Helper function to render text with inline formatting (bold and links)
                  const renderFormattedText = (text: string, className: string = "text-muted-foreground") => {
                    // Split by both bold (**text**) and links ([text](url))
                    const parts = text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);

                    return parts.map((part, i) => {
                      // Handle bold
                      const boldMatch = part.match(/\*\*(.*?)\*\*/);
                      if (boldMatch) {
                        return <strong key={i} className="font-bold text-foreground">{boldMatch[1]}</strong>;
                      }

                      // Handle links
                      const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
                      if (linkMatch) {
                        return (
                          <a
                            key={i}
                            href={linkMatch[2]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-medium"
                          >
                            {linkMatch[1]}
                          </a>
                        );
                      }

                      return part;
                    });
                  };

                  // Handle headings
                  if (line.startsWith('# ')) {
                    return <h1 key={index} className="text-4xl font-black mt-8 mb-4 text-foreground">{line.substring(2)}</h1>;
                  }
                  if (line.startsWith('## ')) {
                    return <h2 key={index} className="text-3xl font-bold mt-8 mb-4 text-foreground">{line.substring(3)}</h2>;
                  }
                  if (line.startsWith('### ')) {
                    return <h3 key={index} className="text-2xl font-bold mt-6 mb-3 text-foreground">{line.substring(4)}</h3>;
                  }

                  // Handle lists with inline formatting
                  if (line.startsWith('- ') || line.startsWith('* ')) {
                    return (
                      <li key={index} className="ml-6 my-2 text-muted-foreground">
                        {renderFormattedText(line.substring(2))}
                      </li>
                    );
                  }
                  if (line.match(/^\d+\. /)) {
                    const content = line.replace(/^\d+\. /, '');
                    return (
                      <li key={index} className="ml-6 my-2 list-decimal text-muted-foreground">
                        {renderFormattedText(content)}
                      </li>
                    );
                  }

                  // Handle horizontal rule
                  if (line === '---') {
                    return <hr key={index} className="my-8 border-border" />;
                  }

                  // Handle checkmarks and crosses
                  if (line.startsWith('✅') || line.startsWith('❌')) {
                    return (
                      <p key={index} className="my-2 font-medium">
                        {renderFormattedText(line)}
                      </p>
                    );
                  }

                  // Regular paragraphs with inline formatting
                  if (line.trim() !== '') {
                    return (
                      <p key={index} className="my-4 text-muted-foreground leading-relaxed">
                        {renderFormattedText(line)}
                      </p>
                    );
                  }

                  return <br key={index} />;
                })}
              </div>
            </div>

            {/* CTA at the end */}
            <div className="mt-16 p-8 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl border-2 border-primary/20">
              <h3 className="text-2xl font-bold mb-3 text-foreground">Ready to Transform Your Career?</h3>
              <p className="text-muted-foreground mb-6">
                Join our Experience Selling Bootcamp and get personalized mentorship for your placement journey.
              </p>
              <Button
                size="lg"
                onClick={() => navigate("/programs")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Explore Programs
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </article>

        {/* Footer */}
        <footer className="bg-foreground/5 border-t border-border">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-muted-foreground text-sm">
                © 2026 UPSTRIDE Learning. All rights reserved.
              </p>
              <p className="text-muted-foreground text-sm">
                MSME Certified | VIT & Saveetha Recognized
              </p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Otherwise, show blog list
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full backdrop-blur-sm z-40 border-b border-border/20">
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate("/")}>
            <img src="/upstride-logo.png" alt="UPSTRIDE Logo" className="h-10 w-10 object-contain" />
            <h1 className="text-2xl font-bold text-foreground">UPSTRIDE</h1>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => navigate("/")}>
              Home
            </Button>
            <Button variant="ghost" onClick={() => navigate("/programs")}>
              Programs
            </Button>
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Portal
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-8 hover:translate-x-[-4px] transition-transform"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <h1 className="text-5xl md:text-6xl font-black mb-6 text-foreground">
            UPSTRIDE Blog
          </h1>
          <p className="text-xl text-muted-foreground">
            Real stories, honest advice, and practical tips from students who've been there
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Card
                key={post.id}
                className={`border-2 border-border hover:border-primary/40 transition-all duration-300 hover:shadow-xl cursor-pointer group animate-fade-in animate-stagger-${(index % 6) + 1}`}
                onClick={() => navigate(`/blog/${post.id}`)}
              >
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-primary/40" />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">{post.readTime}</span>
                    <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/10 to-purple-500/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-foreground">
            Ready to Transform Your Career?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join our Experience Selling Bootcamp and learn from industry experts
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/programs")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg"
          >
            Explore Programs
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © 2026 UPSTRIDE Learning. All rights reserved.
            </p>
            <p className="text-muted-foreground text-sm">
              MSME Certified | VIT & Saveetha Recognized
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Blogs;
