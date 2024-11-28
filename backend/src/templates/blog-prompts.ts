export const blogPrompts = {
  default: {
    name: 'Default Blog Post',
    prompt: `Write a comprehensive blog post about {topic}. The post should:
1. Have an engaging introduction
2. Include relevant subheadings
3. Provide detailed information and examples
4. End with a conclusion
Use markdown formatting.`
  },
  technical: {
    name: 'Technical Tutorial',
    prompt: `Create a detailed technical tutorial about {topic}. Include:
1. Prerequisites and setup instructions
2. Step-by-step implementation guide
3. Code examples where relevant
4. Common pitfalls and solutions
5. Best practices and tips
Use markdown formatting with proper code blocks.`
  },
  review: {
    name: 'Product/Service Review',
    prompt: `Write a balanced review of {topic}. Structure it as follows:
1. Brief overview/introduction
2. Key features and benefits
3. Potential drawbacks or limitations
4. Comparison with alternatives
5. Final verdict and recommendations
Use markdown formatting and include pros/cons lists.`
  },
  howTo: {
    name: 'How-To Guide',
    prompt: `Create a practical how-to guide about {topic}. Include:
1. Clear introduction explaining the goal
2. Required materials or prerequisites
3. Step-by-step instructions
4. Tips for success
5. Troubleshooting common issues
Use markdown formatting with numbered lists and bullet points.`
  },
  opinion: {
    name: 'Opinion Piece',
    prompt: `Write an engaging opinion piece about {topic}. Structure it with:
1. A strong opening statement
2. Clear arguments supporting your position
3. Consideration of counter-arguments
4. Real-world examples or case studies
5. A compelling conclusion
Use markdown formatting and maintain a balanced tone.`
  },
  comparison: {
    name: 'Comparison Article',
    prompt: `Create a detailed comparison of different aspects of {topic}. Include:
1. Introduction to the items being compared
2. Feature-by-feature comparison
3. Pros and cons of each option
4. Use cases and scenarios
5. Recommendations for different user needs
Use markdown tables and bullet points for clear comparison.`
  }
};
