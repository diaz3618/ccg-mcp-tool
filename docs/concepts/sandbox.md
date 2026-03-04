# Sandbox Mode (Gemini Only)

Execute code safely in an isolated environment using Google Gemini's code execution features.

## What is Sandbox Mode?

Sandbox mode allows Gemini to write and test code in a secure, isolated environment provided by Google. This is perfect for verifying logic, processing data, or exploring new algorithms without any risk to your local system.

## Basic Usage

```
/ccg-tool:sandbox prompt:"create a Python script that sorts a list"
```

## Use Cases

### Algorithm Verification
```
/ccg-tool:sandbox prompt:"implement and test quicksort in JavaScript"
```

### Data Analysis
```
/ccg-tool:sandbox prompt:"parse this CSV snippet and show statistics: [data]"
```

## Safety & Isolation

- **Isolated Execution**: No access to your local files or environment.
- **Resource Constraints**: Strict CPU and memory limits.
- **Network Blocked**: Cannot make external API calls or network requests.

## Supported Languages

- **Python** (Native support)
- **JavaScript/Node.js**
- **Ruby**, **Go**, **Java**, **C++**

## How to Trigger

You can use the dedicated sandbox tool or simply ask naturally:
- "Use gemini sandbox to test this function..."
- "Have gemini run a script that..."

## Limitations

- **Provider Specific**: Currently only available when using Google Gemini.
- **Execution Time**: Limited to 30 seconds per run.
- **Environment**: No persistent state between calls.
