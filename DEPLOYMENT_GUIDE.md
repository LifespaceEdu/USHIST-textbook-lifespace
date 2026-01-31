# Interactive Chapter with Vercel KV Storage - Setup Guide

## What You Have

1. **enslaved-africans-chapter.html** - The interactive chapter with auto-save
2. **save-answers.js** - API endpoint to save student answers
3. **load-answers.js** - API endpoint to load student answers

## How It Works

### Student Experience:
1. Opens chapter → prompted for name/student ID
2. System checks Vercel KV for previous answers and loads them
3. As they work, answers auto-save every 30 seconds
4. When they blur a textarea (click away), it saves immediately
5. They can close and reopen on ANY device with their ID to continue
6. Final submission marks their work as "completed"

### Data Storage:
- **Key format:** `chapter:enslaved-africans:{studentId}`
- **Data stored:** All checkbox selections and textarea responses
- **Includes:** Timestamp, completion status

## Deployment Steps

### 1. Set Up Your Vercel Project

If you don't already have the chapter in a Vercel project:

```bash
# In your project directory
mkdir -p api
# Copy the API files to /api directory
# Copy the HTML to /public directory (or root)
```

### 2. Configure Vercel KV

Your Vercel KV is already set up. Just make sure it's connected to your project:
- Go to your Vercel dashboard
- Select your project
- Go to Storage tab
- Verify your KV database is connected

### 3. Update the HTML

Open `enslaved-africans-chapter.html` and find this line (around line 890):

```javascript
const API_BASE_URL = 'https://your-project.vercel.app'; // TODO: Replace
```

Change it to your actual Vercel URL:
```javascript
const API_BASE_URL = 'https://your-actual-project.vercel.app';
```

### 4. File Structure in Your Repo

```
your-repo/
├── api/
│   ├── save-answers.js
│   └── load-answers.js
├── public/ (or root)
│   └── enslaved-africans-chapter.html
└── package.json (if you have one)
```

### 5. Deploy to Vercel

```bash
git add .
git commit -m "Add interactive chapter with KV storage"
git push
```

Or use Vercel CLI:
```bash
vercel --prod
```

## Testing

1. Open your deployed chapter URL
2. Enter a test student ID (like "test-student")
3. Fill in some answers
4. Close the tab
5. Reopen and enter the same ID
6. Verify your answers loaded back

## Viewing Student Submissions

### Option 1: Vercel KV Dashboard
- Go to your Vercel project → Storage → Your KV database
- Browse keys starting with `chapter:enslaved-africans:`
- Click any key to see that student's data

### Option 2: Create an Admin View (Optional)
You could create `/api/get-all-submissions.js` to list all completed work.

## Troubleshooting

**Answers not saving?**
- Check browser console for errors
- Verify API_BASE_URL is correct
- Check Vercel function logs

**Answers not loading?**
- Student ID is case-insensitive and trimmed
- Check that KV database is properly connected

**CORS errors?**
- The API routes already have CORS headers
- If issues persist, you may need to adjust them for your domain

## Multiple Choice vs Single Answer

Currently set up for **single choice** (only one checkbox per question).

If you want **multiple choice** (select multiple answers):
1. Change `input[type="checkbox"]` logic in `collectAllAnswers()`
2. Store arrays instead of single values
3. Update display logic

## Next Steps

- Add email notifications when students complete
- Create admin dashboard to view all submissions  
- Add export to CSV functionality
- Set up different chapters with same system

## Security Note

This uses simple student ID entry with no password. This is fine for:
- Low-stakes assignments
- Trusted classroom environments
- Quick iteration

For higher security:
- Add password field
- Implement proper authentication
- Use session tokens
