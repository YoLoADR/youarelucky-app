'use client';

// Chakra imports
import { Box, Flex, SimpleGrid } from '@chakra-ui/react';

import TemplateCard from '@/components/card/TemplateCard';

export default function Settings() {
  return (
    <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between" alignItems="flex-start" w="100%" p="20px">
      <Box mt={{ base: '70px', md: '0px', xl: '0px' }}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing="20px">
          <TemplateCard
            link="/essay"
            illustration="📝"
            name="Write an Essay"
            description="Generate an Essay based on a type, subject and number of paragraphs."
          />
          <TemplateCard
            link="/simplifier"
            illustration="👶"
            name="Content Simplifier"
            description="Summarize text content for all age types of audience."
          />
          <TemplateCard
            link="/product-description"
            illustration="🎯"
            name="Product Description"
            description="Generate compelling & high converting descriptions for product listings."
          />
          <TemplateCard
            link="/email-enhancer"
            illustration="📧"
            name="Email Enhancer"
            description="Generate an incredibly clickable email from text content."
          />
          <TemplateCard
            link="/linkedin-message"
            illustration="💬"
            name="LinkedIn Message"
            description="Generate a LinkedIn high-converting message based on a type or subject."
          />
          <TemplateCard
            link="/caption"
            illustration="🌄"
            name="Instagram Caption"
            description="Generate a compelling and engaging caption for an Instagram post."
          />
          <TemplateCard
            link="/faq"
            illustration="❓"
            name="FAQs Content"
            description="Generate FAQs for a product, web app, or landing pages."
          />
          <TemplateCard
            link="/name-generator"
            illustration="🏷️"
            name="Product Name Generator"
            description="Generate product names from example words, topics, or work industries."
          />
          <TemplateCard
            link="/seo-keywords"
            illustration="📈"
            name="SEO Keywords"
            description="Generate high-converting SEO keywords from a subject, name, and so on."
          />
          <TemplateCard
            link="/review-responder"
            illustration="🌟"
            name="Review Responder"
            description="Generate an accurate & friendly response based on a customer review."
          />
          <TemplateCard
            link="/business-generator"
            illustration="💡"
            name="Business Idea Generator"
            description="Generate some business ideas based on topics, preferences, or budgets."
          />
          <TemplateCard
            link="/article"
            illustration="📄"
            name="Article Generator"
            description="Generate incredibly clickable and SEO Friendly article content."
          />
          <TemplateCard
            link="/plagiarism-checker"
            illustration="©️"
            name="Plagiarism Checker"
            description="Plagiarism checker for sentences and content."
          />
          <TemplateCard
            link="/hashtags-generator"
            illustration="#️⃣"
            name="Hashtags Generator"
            description="Generate outstanding hashtags for Instagram and social media."
          />
          <TemplateCard
            link="/pet-name-generator"
            illustration="🐶"
            name="Pet Name Generator"
            description="Generate a great name for your pet."
          />
          <TemplateCard
            link="/translator"
            illustration="🈳"
            name="Content Translator"
            description="Translate any type of content into your favorite language."
          />
          <TemplateCard
            link="/domain-name-generator"
            illustration="🔗"
            name="Domain Name Generator"
            description="Generate great domain names for your businesses."
          />
          <TemplateCard
            link="/bootstrap-to-tailwind-converter"
            illustration="💻"
            name="Bootstrap to Tailwind Converter"
            description="Convert any Bootstrap code to Tailwind CSS."
          />
        </SimpleGrid>
      </Box>

    </Flex>
  );
}
