# Phase 6: Execution Guide - Generate 9 Final Reports

## 🎯 Objective

Generate 9 code review reports (3 pull requests × 3 formats each) from real PRs in the `udacity/cd14715-simple-todo-app` repository.

**Timeline**: ~15 minutes total
**Prerequisites**: ANTHROPIC_API_KEY configured
**Output**: 9 files in `reports/` directory

---

## ✅ Pre-Execution Checklist

Before starting, verify:

```bash
# 1. Confirm you're in the correct directory
pwd
# Should show: /voc/work/project/starter

# 2. Verify project structure exists
ls -la src/ tests/ package.json
# Should show all project files

# 3. Check npm is available
npm --version
# Should show version number

# 4. Verify .env file template exists
cat .env.example
# Should show environment variable template
```

---

## 📋 Step-by-Step Execution

### STEP 1: Create and Configure .env File (2 minutes)

```bash
# Create .env from template
cp .env.example .env

# Verify file was created
ls -la .env

# Open and edit the file
nano .env
# or: vim .env
# or: open .env (macOS)
# or: edit .env (Windows)

# ADD YOUR API KEY:
# Uncomment and fill in:
# ANTHROPIC_API_KEY=sk-ant-...your-api-key-here...

# Optional - set model (defaults to claude-opus-4-5-20251101):
# ANTHROPIC_MODEL=claude-opus-4-5-20251101

# Save file (Ctrl+X in nano, then Y, then Enter)
```

**What your .env should look like**:
```env
ANTHROPIC_API_KEY=sk-ant-v7-AbCdEfGhIjKlMnOpQrStUvWxYz1234567890...
```

**Where to get your API key**:
1. Visit https://console.anthropic.com/
2. Go to "API Keys" section
3. Click "Create New Key"
4. Copy the key (starts with `sk-ant-`)
5. Paste into .env file

**Verify setup**:
```bash
# Check API key is in .env
grep ANTHROPIC_API_KEY .env
# Should output: ANTHROPIC_API_KEY=sk-ant-...

# Make sure it's not empty
cat .env | grep -v "^#" | grep -v "^$"
# Should show your configured variables
```

---

### STEP 2: Verify Everything is Ready (3 minutes)

```bash
# Build the project
npm run build
# Output should end with no errors

# Run all tests
npm test
# Output should show: 60+ tests passing

# Check reports directory
mkdir -p reports
ls -la reports/
# Should be empty at this point
```

**Expected output for `npm run build`**:
```
> multi-agent-code-review@1.0.0 build
> tsc
# (no output = success!)
```

**Expected output for `npm test`**:
```
✓ [60+] tests passing
# All test cases should pass
```

---

### STEP 3: Run First Analysis (3-5 minutes per PR)

#### PR #1: Clean Code Fixture

```bash
npm run dev -- udacity cd14715-simple-todo-app 1
```

**What to expect**:

```
📋 Code Review System - Part 2
═══════════════════════════════════════════════════════════════════════════

🔍 Analyzing PR: udacity/cd14715-simple-todo-app#1

✅ Code Review Completed

Overall Score: XX/100
Code Quality: XX/100
Test Coverage: XX%
Refactoring Opportunities: X

📝 Generating reports...

✅ Reports saved:

  📄 JSON:     reports/udacity_cd14715-simple-todo-app_1.json
  📋 Markdown: reports/udacity_cd14715-simple-todo-app_1.md
  🌐 HTML:     reports/udacity_cd14715-simple-todo-app_1.html

═══════════════════════════════════════════════════════════════════════════

📌 Summary:
[Report summary will appear here]
```

**Timing**:
- API call: 10-30 seconds
- Report generation: 1-5 seconds
- Total: 15-40 seconds

**If you see errors**:
- "No auth configured" → Check .env has ANTHROPIC_API_KEY
- "Operation timed out" → Network issue, try again
- "No text response" → API issue, wait and retry

**After success**:
✅ 3 files created:
- `reports/udacity_cd14715-simple-todo-app_1.json` (~10 KB)
- `reports/udacity_cd14715-simple-todo-app_1.md` (~20 KB)
- `reports/udacity_cd14715-simple-todo-app_1.html` (~80 KB)

---

#### PR #2: Search Functionality

```bash
npm run dev -- udacity cd14715-simple-todo-app 2
```

**Same process as PR #1**

**After success**:
✅ 3 more files created:
- `reports/udacity_cd14715-simple-todo-app_2.json`
- `reports/udacity_cd14715-simple-todo-app_2.md`
- `reports/udacity_cd14715-simple-todo-app_2.html`

**Running multiple analyses**:
If you want to run them back-to-back:
```bash
npm run dev -- udacity cd14715-simple-todo-app 1 && \
npm run dev -- udacity cd14715-simple-todo-app 2 && \
npm run dev -- udacity cd14715-simple-todo-app 3
```

Or run them separately with time between:
```bash
npm run dev -- udacity cd14715-simple-todo-app 1
# Wait 2-5 minutes
npm run dev -- udacity cd14715-simple-todo-app 2
# Wait 2-5 minutes
npm run dev -- udacity cd14715-simple-todo-app 3
```

---

#### PR #3: Premium Subscription Features

```bash
npm run dev -- udacity cd14715-simple-todo-app 3
```

**Same process**

**After success**:
✅ Final 3 files created:
- `reports/udacity_cd14715-simple-todo-app_3.json`
- `reports/udacity_cd14715-simple-todo-app_3.md`
- `reports/udacity_cd14715-simple-todo-app_3.html`

---

### STEP 4: Verify All Reports Created (2 minutes)

```bash
# Count total files
ls reports/ | wc -l
# Should output: 9

# List all files with sizes
ls -lh reports/
# Should show:
# -rw-r--r-- ... reports/udacity_cd14715-simple-todo-app_1.json
# -rw-r--r-- ... reports/udacity_cd14715-simple-todo-app_1.md
# -rw-r--r-- ... reports/udacity_cd14715-simple-todo-app_1.html
# ... (9 files total)

# Check file sizes are reasonable
du -sh reports/*
# JSON: 5-20 KB each
# Markdown: 10-30 KB each
# HTML: 50-100 KB each
```

---

### STEP 5: Validate Report Content (3 minutes)

#### Validate JSON Files

```bash
# Test PR 1 JSON
cat reports/udacity_cd14715-simple-todo-app_1.json | jq . > /dev/null
# Should complete without error (valid JSON)

# Check specific fields
cat reports/udacity_cd14715-simple-todo-app_1.json | jq '.owner'
# Should output: "udacity"

cat reports/udacity_cd14715-simple-todo-app_1.json | jq '.codeQuality.score'
# Should output: a number 0-100

cat reports/udacity_cd14715-simple-todo-app_1.json | jq '.testCoverage.estimatedCoverage'
# Should output: a number 0-100

# Check all 3 JSON files
for i in 1 2 3; do
  echo "Validating PR $i..."
  cat reports/udacity_cd14715-simple-todo-app_$i.json | jq . > /dev/null && echo "✓ Valid JSON"
done
```

#### Validate Markdown Files

```bash
# Check markdown structure
head -20 reports/udacity_cd14715-simple-todo-app_1.md
# Should show:
# # Code Review Report
# **Repository:** udacity/cd14715-simple-todo-app
# **PR Number:** #1
# ...

# Check all 3 Markdown files exist and have content
for i in 1 2 3; do
  SIZE=$(wc -c < reports/udacity_cd14715-simple-todo-app_$i.md)
  echo "PR $i Markdown: $SIZE bytes"
done
```

#### Validate HTML Files

```bash
# Check HTML structure
head -5 reports/udacity_cd14715-simple-todo-app_1.html
# Should start with:
# <!DOCTYPE html>

# Check DOCTYPE present
grep -c "DOCTYPE" reports/udacity_cd14715-simple-todo-app_1.html
# Should output: 1

# Check styling is included
grep -c "<style>" reports/udacity_cd14715-simple-todo-app_1.html
# Should output: 1 or more

# View HTML file (this will open in default browser)
open reports/udacity_cd14715-simple-todo-app_1.html   # macOS
# or: start reports/udacity_cd14715-simple-todo-app_1.html   # Windows
# or: firefox reports/udacity_cd14715-simple-todo-app_1.html # Linux
```

---

## 🎯 Success Indicators

### After Each PR Analysis
- ✅ Command completes without error
- ✅ 3 files created (JSON, MD, HTML)
- ✅ Files have content (not empty)
- ✅ Output shows scores and summary

### After All 3 PRs Complete
```bash
ls -1 reports/ | sort
# Output should show 9 files:
# udacity_cd14715-simple-todo-app_1.html
# udacity_cd14715-simple-todo-app_1.json
# udacity_cd14715-simple-todo-app_1.md
# udacity_cd14715-simple-todo-app_2.html
# udacity_cd14715-simple-todo-app_2.json
# udacity_cd14715-simple-todo-app_2.md
# udacity_cd14715-simple-todo-app_3.html
# udacity_cd14715-simple-todo-app_3.json
# udacity_cd14715-simple-todo-app_3.md
```

### Validation Checklist
- [ ] 9 files in reports/ directory
- [ ] All files have reasonable sizes
- [ ] JSON files validate with jq
- [ ] Markdown files have headers
- [ ] HTML files have DOCTYPE
- [ ] No "undefined" values in JSON
- [ ] No empty files

---

## 🐛 Troubleshooting Guide

### Error: "No authentication configured"

```
❌ Error: No authentication configured

You must configure ONE of the following:
1. Anthropic API:
   export ANTHROPIC_API_KEY=sk-...
2. AWS Bedrock:
   export AWS_ACCESS_KEY_ID=...
   export AWS_SECRET_ACCESS_KEY=...
```

**Solution**:
```bash
# Edit .env file
nano .env

# Add your API key
ANTHROPIC_API_KEY=sk-ant-...

# Save and try again
npm run dev -- udacity cd14715-simple-todo-app 1
```

---

### Error: "Operation exceeded timeout of 60000ms"

```
❌ ReviewError: Operation exceeded timeout of 60000ms
```

**Solution**:
- System will auto-retry (up to 3 times)
- Wait a few minutes
- Try again: `npm run dev -- udacity cd14715-simple-todo-app 1`

---

### Error: "No text response received"

```
❌ Error during code review: Error: No text response received
```

**Possible Causes**:
- API quota exceeded
- Network connectivity issue
- API temporarily unavailable

**Solution**:
```bash
# Wait 5-10 minutes
sleep 600

# Try again
npm run dev -- udacity cd14715-simple-todo-app 1

# Or use debug mode for more info
DEBUG=1 npm run dev -- udacity cd14715-simple-todo-app 1
```

---

### Error: "mkdir: reports: File exists"

**Solution** (not really an error):
```bash
# This just means the directory already exists
# Continue normally
npm run dev -- udacity cd14715-simple-todo-app 1
```

---

### Error: "Command not found: npm"

```bash
# Check npm is installed
npm --version
# If not installed, install Node.js from https://nodejs.org/

# Try running npm install first
npm install
npm run build
npm run dev -- udacity cd14715-simple-todo-app 1
```

---

## 📊 Expected Results Summary

### File Structure After Completion
```
reports/
├── udacity_cd14715-simple-todo-app_1.json (~10 KB)
├── udacity_cd14715-simple-todo-app_1.md (~20 KB)
├── udacity_cd14715-simple-todo-app_1.html (~80 KB)
├── udacity_cd14715-simple-todo-app_2.json (~10 KB)
├── udacity_cd14715-simple-todo-app_2.md (~20 KB)
├── udacity_cd14715-simple-todo-app_2.html (~80 KB)
├── udacity_cd14715-simple-todo-app_3.json (~10 KB)
├── udacity_cd14715-simple-todo-app_3.md (~20 KB)
└── udacity_cd14715-simple-todo-app_3.html (~80 KB)

Total: 9 files, ~300-400 KB combined
```

### Expected Timing
```
Setup:              5 minutes
Build & Test:       2 minutes
PR #1 Analysis:     1-2 minutes
PR #2 Analysis:     1-2 minutes
PR #3 Analysis:     1-2 minutes
Verification:       2-3 minutes
─────────────────────────────
Total:              ~15 minutes
```

---

## ✅ Final Verification

After all reports are generated:

```bash
# 1. Verify file count
echo "Total files: $(ls reports/ | wc -l)"
# Should output: 9

# 2. Verify all PRs analyzed
echo "PR 1:" && ls reports/udacity_cd14715-simple-todo-app_1.*
echo "PR 2:" && ls reports/udacity_cd14715-simple-todo-app_2.*
echo "PR 3:" && ls reports/udacity_cd14715-simple-todo-app_3.*

# 3. Verify no corrupted files
for file in reports/*; do
  SIZE=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
  if [ $SIZE -eq 0 ]; then
    echo "ERROR: $file is empty!"
  else
    echo "✓ $file ($SIZE bytes)"
  fi
done

# 4. Spot check content
echo "Sample JSON content:"
cat reports/udacity_cd14715-simple-todo-app_1.json | jq '.owner, .repo, .prNumber, .overallScore'
```

---

## 🎯 Ready for Submission?

Before submitting, check:

```bash
# 1. All 9 files exist
ls reports/ | wc -l
# Should show: 9

# 2. All JSON files valid
for i in 1 2 3; do
  cat reports/udacity_cd14715-simple-todo-app_$i.json | jq . > /dev/null || echo "ERROR in PR $i"
done
# Should produce no ERROR output

# 3. All files have reasonable size
ls -lh reports/ | grep -v "^total" | awk '{print $5}' | sort
# All should be non-zero

# 4. Source code and tests still present
test -d src && test -d tests && test -f package.json && echo "✓ All project files present"
```

**If all checks pass**: ✅ **Ready for Submission!**

---

## 📋 Next: Submission

See `SUBMISSION_CHECKLIST.md` for final verification before submitting.

Package includes:
- ✅ All source code (src/)
- ✅ All tests (tests/)
- ✅ All documentation (*.md files)
- ✅ All 9 reports (reports/)
- ✅ Configuration files (package.json, tsconfig.json)

---

## 🚀 You're Ready!

Everything is set up and ready. Just follow the steps above and you'll have all 9 reports in ~15 minutes!

**Let's go!** 🎉
