# Sandbox Mode (Gemini only)

Execute code in an isolated environment using Gemini's sandbox feature.

## Usage

```
/ccg-tool:ask-ai prompt:"implement and test quicksort" sandbox:true
```

Or naturally:

```
Use gemini sandbox to test this sorting algorithm
```

## What it does

- Runs code in an isolated environment provided by Google
- No access to your local files or environment
- Strict CPU and memory limits
- No network access

## Supported languages

Python, JavaScript/Node.js, Ruby, Go, Java, C++.

## Limitations

- Only available with Gemini provider
- 30-second execution time limit
- No persistent state between calls
