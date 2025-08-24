<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Credit Card Assistant</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .typing-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: #3b82f6;
            margin-right: 4px;
            opacity: 0.6;
            animation: typing-animation 1s infinite alternate;
        }
        .typing-indicator:nth-child(2) {
            animation-delay: 0.2s;
        }
        .typing-indicator:nth-child(3) {
            animation-delay: 0.4s;
        }
        @keyframes typing-animation {
            0% { transform: scale(1); }
            100% { transform: scale(1.5); opacity: 1; }
        }
        .prose table {
            border-collapse: collapse;
            width: 100%;
            margin: 1rem 0;
        }
        .prose th, .prose td {
            border: 1px solid #e5e7eb;
            padding: 0.5rem;
            text-align: left;
        }
        .prose th {
            background-color: #f9fafb;
            font-weight: 600;
        }
        .prose ul {
            list-style-type: disc;
            padding-left: 1.5rem;
            margin: 1rem 0;
        }
        .prose ol {
            list-style-type: decimal;
            padding-left: 1.5rem;
            margin: 1rem 0;
        }
    </style>
</head>
<body class="bg-gray-100 min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-2xl mx-auto mt-8 bg-gray-50 rounded-2xl shadow-lg flex flex-col p-6">
        <!-- Chat Window -->
        <div class="min-h-[320px] max-h-[65vh] overflow-y-auto mb-4 space-y-4">
            <!-- Welcome message -->
            <div class="w-fit max-w-xl p-4 rounded-xl bg-white text-gray-900 mr-auto shadow">
                <div class="prose prose-sm max-w-none text-gray-800">
                    <h3>Welcome to Credit Card Assistant!</h3>
                    <p>I can help you find the best credit cards based on your needs. Try asking:</p>
                    <ul>
                        <li>"What's the best cash back card?"</li>
                        <li>"Find travel cards with no annual fee"</li>
                        <li>"Compare cards with good sign-up bonuses"</li>
                    </ul>
                </div>
            </div>
            
            <!-- Example bot message with apply button -->
            <div class="w-fit max-w-xl p-4 rounded-xl bg-white text-gray-900 mr-auto shadow">
                <div class="prose prose-sm max-w-none text-gray-800">
                    <p>Based on your spending habits, I recommend the <strong>Premium Cash Back Card</strong>:</p>
                    <ul>
                        <li>5% cash back on groceries</li>
                        <li>3% on gas and streaming services</li>
                        <li>1% on all other purchases</li>
                        <li>$200 sign-up bonus after $500 spend in first 3 months</li>
                    </ul>
                    <div class="mt-4">
                        <button class="apply-btn bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition">
                            Apply Now
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Example user message -->
            <div class="w-fit max-w-xl p-4 rounded-xl bg-blue-600 text-white ml-auto">
                <div>What's the best cash back card?</div>
            </div>
            
            <!-- Example bot message with table and button -->
            <div class="w-fit max-w-xl p-4 rounded-xl bg-white text-gray-900 mr-auto shadow">
                <div class="prose prose-sm max-w-none text-gray-800">
                    <p>Here's a comparison of top cash back cards:</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Card</th>
                                <th>Annual Fee</th>
                                <th>Sign-up Bonus</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Cash Back Plus</td>
                                <td>$0</td>
                                <td>$200 after $500 spend</td>
                                <td>
                                    <button class="apply-btn bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1 px-2 rounded transition">
                                        Apply
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>Premium Rewards</td>
                                <td>$95</td>
                                <td>50,000 points</td>
                                <td>
                                    <button class="apply-btn bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1 px-2 rounded transition">
                                        Apply
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>Everyday Cash</td>
                                <td>$0</td>
                                <td>$100 after $500 spend</td>
                                <td>
                                    <button class="apply-btn bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1 px-2 rounded transition">
                                        Apply
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Input Bar -->
        <div class="flex items-end gap-2 bg-white p-4 rounded-xl shadow">
            <textarea
                rows="2"
                placeholder="Ask me anything about credit cards..."
                class="flex-grow border rounded-md px-4 py-2 resize-none focus:ring-2 focus:ring-blue-500 outline-none transition"
            ></textarea>
            <button
                class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition"
            >
                Ask
            </button>
        </div>
    </div>

    <script>
        // Function to parse HTML responses and replace URLs with buttons
        function processResponse(html) {
            // Create a temporary container
            const container = document.createElement('div');
            container.innerHTML = html;
            
            // Find all links that might be "apply" links
            const links = container.querySelectorAll('a');
            
            links.forEach(link => {
                // Check if this looks like an application link
                const linkText = link.textContent.toLowerCase();
                const href = link.getAttribute('href');
                
                if (linkText.includes('apply') || href.includes('apply')) {
                    // Replace with a button
                    const button = document.createElement('button');
                    button.textContent = link.textContent || 'Apply Now';
                    button.className = 'apply-btn bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition';
                    button.setAttribute('data-url', href);
                    
                    // Replace the link with the button
                    link.parentNode.replaceChild(button, link);
                }
            });
            
            return container.innerHTML;
        }
        
        // Example of how to use the processResponse function
        const exampleResponse = `
            <p>I recommend the <a href="https://example.com/apply/123">Apply Now</a> for your needs.</p>
            <p>Or you can <a href="https://example.com/application/456">submit your application here</a>.</p>
        `;
        
        console.log("Original HTML:", exampleResponse);
        console.log("Processed HTML:", processResponse(exampleResponse));
        
        // Add event listener for apply buttons
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('apply-btn')) {
                const url = e.target.getAttribute('data-url');
                if (url) {
                    alert(`Redirecting to application: ${url}`);
                    // In a real implementation, you would use:
                    // window.open(url, '_blank');
                }
            }
        });
    </script>
</body>
</html>
