<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'DbConnect.php';

// Debug log file
function logToFile($title, $data) {
    $logFile = __DIR__ . '/query.log';
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "\n[$timestamp] $title:\n" . print_r($data, true), FILE_APPEND);
}

$db = new DbConnect();
$pdo = $db->connect();

if (!$pdo) {
    logToFile("Database Connection", "Failed");
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);
$question = $input['question'] ?? '';

logToFile("User Question", $question);

if (!$question) {
    logToFile("Error", "No question provided");
    echo json_encode(['error' => 'No question provided']);
    exit;
}

$openAiApiKey = 'your-api-key';

function callOpenAI($messages, $apiKey) {
    $ch = curl_init('https://api.openai.com/v1/chat/completions');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode([
            'model' => 'gpt-4o-mini-2024-07-18',
            'messages' => $messages
        ]),
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $apiKey
        ]
    ]);
    $res = curl_exec($ch);
    if (curl_errno($ch)) {
        return ['error' => 'Curl error: ' . curl_error($ch)];
    }
    curl_close($ch);
    return json_decode($res, true);
}

// Step 1: Generate SQL
$sqlGenMessages = [
    ['role' => 'system', 'content' => <<<PROMPT
    You are a helpful assistant that only generates MySQL SELECT queries based on natural language input related to Final Year Projects (FYP) for BS students and Thesis projects for MS students.

    Database Tables
    
    groups
    (id, project_title, tech_stack, supervisor, advisor, co_advisor, defense_doc, mid_doc, final_doc, year, bs_program, project_type, created_at, proposal_remarks, mid_remarks, final_remarks, proposal_file, mid_file, final_file)
    
    group_members
    (id, group_id, name, reg_no, phone, email)
    
    ms_thesis
    (id, student_name, reg_no, email, phone, year, program, thesis_title, research_area, thesis_type, supervisor_name, co_supervisor_name, proposal_file, progress_file, final_thesis_file, proposal_status, progress_status, final_status, proposal_remarks, progress_remarks, final_remarks, thesis1_status, thesis2_status, created_at)
    
    Rules
    
    Always return a valid MySQL SELECT query or the result data if requested.
    Only return data values, counts, and groupings when asked — no explanations, interpretations, or chart creation instructions.
    Do not include suggestions like “you can use this data to create a chart.”
    Do not include markdown, comments, or any unnecessary formatting.
    Return query results in clean plain format: counts, breakdowns, and values only.
    Do not return any other SQL statements like INSERT, UPDATE, DELETE.
    
    Understanding Keywords
    
    When the user refers to:
    "BS projects" or "BS groups" → target the groups table
    "MS projects" or "MS thesis" → target the ms_thesis table
    
    Only use the tech_stack column in the groups table if the user specifically mentions a technology (like React, Python, etc.).
    
    When user mentions:
    "project type" in BS → refer to project_type in groups
    "program type" in BS → refer to bs_program in groups
    "program type" in MS → refer to program in ms_thesis
    "project type" in MS → refer to thesis_type in ms_thesis
    
    When filtering by year:
    Use groups.year for BS projects
    Use ms_thesis.year or YEAR(ms_thesis.created_at) for MS thesis depending on context

    Status Field Understanding
    - For BS projects, `defense_doc`, `mid_doc`, and `final_doc` can each have one of these values: `Incomplete`, `In Process`, `Completed`.
    - For MS thesis, `thesis1_status`, `thesis2_status`, `proposal_status`, `progress_status`, and `final_status` also have one of these values: `Incomplete`, `In Process`, `Completed`.

Always filter by the specific status if the user asks for projects “In process”, “Incomplete”, or “Completed” using the appropriate column and value.
    
    Query Mapping Examples
    
    "Show me all BS projects" → query from groups
    "List all MS thesis of software based type" → query from ms_thesis where thesis_type = 'Software Based'
    "Show all projects of 2024" → query from both groups where year = 2024 and ms_thesis where year = 2024
    "Compare MS thesis by program type" → GROUP BY program in ms_thesis
    "Compare BS projects by project type" → GROUP BY project_type in groups
    "Show BS projects using Python" → query groups where tech_stack LIKE '%Python%'
    "Show MS projects of 2023 in software type" → query ms_thesis where year = 2023 and thesis_type = 'Software Based'
    "Show BS projects of 2025" → query groups where year = 2025
    
    If user asks for visual breakdown (e.g. for pie chart), return only grouped data with counts, like:
        SELECT bs_program, COUNT(*) as total FROM groups WHERE year = 2025 GROUP BY bs_program;
        SELECT project_type, COUNT(*) as total FROM groups WHERE year = 2025 GROUP BY project_type;
        
PROMPT],
    ['role' => 'user', 'content' => $question]
];

$sqlResponse = callOpenAI($sqlGenMessages, $openAiApiKey);
logToFile("SQL LLM Response", $sqlResponse);

$sqlQueryRaw = trim($sqlResponse['choices'][0]['message']['content'] ?? '');

// Remove markdown formatting if present
$sqlQuery = preg_replace('/```(?:sql)?|```/', '', $sqlQueryRaw);
$sqlQuery = trim($sqlQuery);
// Auto-escape reserved keywords like 'groups'
$sqlQuery = preg_replace('/\bgroups\b/i', '`groups`', $sqlQuery);


logToFile("Generated SQL", $sqlQuery);

if (!$sqlQuery || stripos($sqlQuery, 'select') !== 0) {
    logToFile("SQL Validation Failed", $sqlQuery);
    echo json_encode([
        'error' => 'Failed to generate valid SQL query.',
        'query' => $sqlQuery,
        'raw' => $sqlResponse
    ]);
    exit;
}

// Step 2: Run SQL
try {
    $stmt = $pdo->query($sqlQuery);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    logToFile("SQL Query Results", $results);
} catch (Exception $e) {
    logToFile("SQL Error", ['message' => $e->getMessage(), 'query' => $sqlQuery]);
    echo json_encode([
        'error' => 'SQL error',
        'message' => $e->getMessage(),
        'query' => $sqlQuery
    ]);
    exit;
}

// Step 3: Generate Explanation
$responseGenMessages = [
    ['role' => 'system', 'content' => 'When responding to a user query, follow these rules:

    1. If the question includes terms like "in detail", "explain", or "elaborate", then:
       - Provide a structured and complete answer in a formal and professional tone.
       - Organize the information in a structured format with Bold and large fonts for headings or lines for better readibility and line breaks for clarity if needed.
       - Do not add unnecessary suggestions, interpretations, or commentary.
       - Only include factual content directly derived from the data.
       - Avoid using bold formatting, bullet points, or emojis.
    
    2. If the question does not request detailed explanation:
       - Return only the key information, summary, values, or groupings.
       - Do not include suggestions like "you can use this data to create a chart".
       - Do not explain or interpret the meaning of the results.
       - Present the output in a clean, readable format using simple line breaks.
       - Keep the response minimal and direct.
    
    This rule-based behavior ensures that casual queries receive concise results, and intentional detailed queries are answered comprehensively without commentary or visual guidance.
    '],
    ['role' => 'user', 'content' => "Question: $question\n\nQuery: $sqlQuery\n\nResults:\n" . json_encode($results)]
];

$responseAnswer = callOpenAI($responseGenMessages, $openAiApiKey);
logToFile("Answer LLM Response", $responseAnswer);

if (!isset($responseAnswer['choices'][0]['message']['content'])) {
    logToFile("Answer Generation Failed", $responseAnswer);
    echo json_encode([
        'error' => 'OpenAI did not return an answer.',
        'raw_response' => $responseAnswer
    ]);
    exit;
}

$answer = trim($responseAnswer['choices'][0]['message']['content']);

// Step 4: Generate Chart
$chartGenMessages = [
    ['role' => 'system', 'content' => <<<SYS
You are a chart generator. Given data and a question, return JSON in this format:

{
  "type": "bar" | "pie" | "line",
  "labels": ["Label1", "Label2"],
  "datasets": [
    { "label": "Data Label", "data": [10, 20] }
  ]
}
Only return the JSON object. Do not include explanations or markdown.
SYS],
    ['role' => 'user', 'content' => "Question: $question\n\nResults:\n" . json_encode($results)]
];

$chartResponse = callOpenAI($chartGenMessages, $openAiApiKey);
logToFile("Chart LLM Response", $chartResponse);

$chartContent = trim($chartResponse['choices'][0]['message']['content'] ?? '{}');
$chartContent = preg_replace('/```(?:json)?|```/', '', $chartContent);
$chartData = json_decode($chartContent, true);
logToFile("Parsed Chart JSON", $chartData);

// Final Output
$responsePayload = [
    'query' => $sqlQuery,
    'answer' => $answer,
    'chartData' => $chartData,
    'rawResults' => $results
];

logToFile("Final Output", $responsePayload);

echo json_encode($responsePayload);
