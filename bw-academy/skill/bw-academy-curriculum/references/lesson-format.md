
# BW Academy Lesson Builder

Every BW Academy session follows the same six-part flow. The flow is designed so a learner can complete a session on their phone in roughly 20–30 minutes: get curious, learn from the teacher, lock it in with a picture, go deeper, prove they got it, then live it out. Keep that learner experience in mind: short, warm, concrete, and mobile-friendly.

## Inputs to gather

Work from whatever the user provides: a topic, a teaching outline, a transcript of the teacher video, a sermon, notes, or an existing resource. Only ask a question if something essential is missing (usually the topic or the main takeaway). Otherwise make sensible choices and note any assumptions at the end so the user can adjust them.

Useful details, if they're available:
- Topic and the single main takeaway
- Audience (age, new vs. experienced learners)
- Teacher name (used in the script's welcome) and whether a transcript or outline already exists
- Any resources the user already wants to use in Explore
- Course or series name and session number

If the topic is faith-based, ground the lesson in Scripture and cite references (book chapter:verse). Don't invent quotations; paraphrase unless you're certain of the wording, and name the translation when you quote.

## The six parts

### 1. Hook: Session Intro
Styled like the cover of a magazine. It should make the learner want to start.
- **Headline:** 3–8 punchy words (the magazine cover title)
- **Teaser:** one or two sentences that create curiosity or tension and say why the topic matters to the learner's real life
- **Cover image idea:** a one-line description of the visual (for a designer or image generator)
- Optional: 2–3 short "cover lines" (like magazine sidebars) previewing what's inside

### 2. Watch: Teacher Video (5–10 min)
The core teaching. This section always has two parts:

**a) Video outline:** a quick-glance summary for planning and editing:
- Opening line
- 2–3 key points, each with a sentence of explanation and a supporting example, story or Scripture
- Closing line that sets up the analogy

**b) Teleprompter script:** the full, word-for-word voiceover the teacher reads on camera. If the user supplied a transcript, polish it into this form. Otherwise write it from the outline. Teachers paste it straight into a teleprompter app, so write it to be *read aloud cold*:
- **Length:** target about 1,100 words (about 8 minutes at 140 words per minute). Stay between 700 and 1,400 words, and state the word count and estimated run time above the script.
- **Voice:** first person, warm, conversational, like talking to one person across a table. Use contractions and short sentences (mostly under 20 words), and one idea per paragraph. Keep paragraphs to 2–4 lines so the teacher never loses their place.
- **Structure:** a 15-second cold open (a question, story or surprising statement, not "Hi, I'm…") → a brief welcome and what we'll cover → key points with a story or example for each → a recap → a hand-off line into the analogy and the rest of the session ("Next, I want you to think of it this way…").
- **Plain text only:** no bullets, bold, headings, emoji or symbols inside the script, because teleprompter apps show them literally. Write everything as it should be spoken. Spell out numbers when spoken ("three things"), and write Scripture references as spoken ("Matthew chapter six, verse nine"). Add a pronunciation guide in parentheses for hard names, like Habakkuk (HAB-uh-kuk).
- **Delivery cues:** in square brackets, on their own line, used sparingly: [PAUSE], [SLOW DOWN], [SMILE], [B-ROLL: description], [ON SCREEN: verse or key phrase]. Many teleprompter apps let you hide bracketed text, and editors use the B-ROLL and ON SCREEN cues.
- **Scripture:** quote it only if you're certain of the wording and name the translation once ("in the NIV it says…"). Otherwise paraphrase it naturally.
- **Fencing:** put the script between `=== TELEPROMPTER SCRIPT START ===` and `=== TELEPROMPTER SCRIPT END ===` lines so it's easy to find and copy as a block. In a chat reply, also put it in a plain code block so it can be copied with one tap.

### 3. Think of It This Way: Quick Analogy
One analogy that connects the main idea to something familiar from everyday life. Write 2–4 sentences: set up the picture, then explicitly connect it back ("In the same way…"). Choose something the audience actually experiences; avoid analogies that need their own explanation.

### 4. Explore: Go Deeper (5–10 min)
One supporting resource: a YouTube video **or** an article/PDF. Give:
- Title, source/creator, type, approximate length
- Link (only if verified; otherwise give a search phrase and mark it "to find")
- 1–2 sentences on why it's worth the learner's time
- One "watch/read for…" prompt that focuses their attention
Never fabricate a URL. If you can't browse, suggest what to look for and flag it for the user to source.

### 5. Check In: 3 Quick Questions
Exactly three questions, one in each format, moving from recall to reflection:
- **Pick One (tap to answer):** multiple choice, 3–4 options, one clearly correct answer. Mark the correct answer and give a one-line explanation shown after answering.
- **Show It (write your answer):** short written response applying the idea. Include a brief "what a good answer includes" note for the teacher.
- **Say It (30-second audio):** a prompt the learner can answer out loud in about 30 seconds, personal and conversational.

### 6. Today's Challenge
One specific, doable action the learner takes within the next day or week to live out the lesson. Make it concrete (who/what/when), small enough to actually do, and connected to the main takeaway. Optionally add a "stretch" version.

## Output format

Unless the user asks for something else, produce the lesson in this Markdown structure so every lesson looks the same:

```markdown
# [Course/Series] · Session [#]: [Lesson Title]
**Main takeaway:** [one sentence]
**Audience:** [who] · **Estimated time:** [total min]

## 1 · Hook
**Headline:** …
**Teaser:** …
**Cover image:** …

## 2 · Watch: Teacher Video ([x] min)
### Video Outline
- Opening: …
- Point 1: …
- Point 2: …
- Point 3: …
- Close: …

### Teleprompter Script
*[word count] words · about [x] min at 140 wpm*

=== TELEPROMPTER SCRIPT START ===
[Cold open paragraph…]

[PAUSE]

[Script continues in short spoken paragraphs…]
=== TELEPROMPTER SCRIPT END ===

## 3 · Think of It This Way
…

## 4 · Explore ([x] min)
**[Title]** · [Source] · [Video/Article/PDF] · [length]
Link: …
Why it matters: …
Watch/read for: …

## 5 · Check In
**Pick One:** [question]
- A) … 
- B) … ✅
- C) …
*Why:* …

**Show It:** [prompt]
*A good answer includes:* …

**Say It (30 sec):** [prompt]

## 6 · Today's Challenge
…
*Stretch:* …

---
**Notes for the editor:** [assumptions made, items to verify, links to source]
```

