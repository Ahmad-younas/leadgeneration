import React from 'react';
import {
  Box,
  Container,
  Heading,
  Link,
  List,
  ListItem,
  Text,
} from '@chakra-ui/react';
import { Footer } from '../Components/Footer';

export const TermsAndCondition = () => {
  return (
    <Container maxW="7xl" py={10} px={4}>
      <Box bg="white" boxShadow="md" borderRadius="md" p={6}>
        <Heading as="h1" size="2xl" textAlign="center" mb={6} color="teal.600">
          Terms and Conditions
        </Heading>

        <Heading as="h2" size="lg" color="teal.500" mb={4}>
          1. Acceptance of Terms
        </Heading>
        <Text mb={6}>
          By accessing or using the portal application ("the App") provided by
          [Your Company Name], you agree to abide by these Terms and Conditions.
          If you disagree with any part of these terms, you must discontinue use
          of the App.
        </Text>

        <Heading as="h2" size="lg" color="teal.500" mb={4}>
          2. Use of the App
        </Heading>
        <Text fontWeight="bold" mb={3}>
          Purpose:
        </Text>
        <Text mb={4}>
          The App is designed for managing employees and job-related
          information, including adding employees and jobs, updating job
          statuses, tracking calendar events, and integrating with Dropbox and
          Google Sheets.
        </Text>
        <Text fontWeight="bold" mb={3}>
          User Responsibility:
        </Text>
        <Text mb={6}>
          Users are responsible for the accuracy and legality of the information
          entered into the App.
        </Text>

        <Heading as="h2" size="lg" color="teal.500" mb={4}>
          3. Account and Security
        </Heading>
        <Text fontWeight="bold" mb={3}>
          User Accounts:
        </Text>
        <Text mb={4}>
          Certain features may require users to create an account. You are
          responsible for maintaining the confidentiality of your login
          credentials.
        </Text>
        <Text fontWeight="bold" mb={3}>
          Security:
        </Text>
        <Text mb={6}>
          You agree to notify us of any unauthorized use of your account or
          security breaches. We are not liable for any losses caused by
          unauthorized access to your account.
        </Text>

        <Heading as="h2" size="lg" color="teal.500" mb={4}>
          4. Prohibited Conduct
        </Heading>
        <List spacing={3} mb={6}>
          <ListItem>
            Use the App for any unlawful or unauthorized purpose.
          </ListItem>
          <ListItem>
            Interfere with the operation of the App or attempt to bypass
            security measures.
          </ListItem>
          <ListItem>
            Submit or transmit any harmful code, such as viruses or malware.
          </ListItem>
        </List>

        <Heading as="h2" size="lg" color="teal.500" mb={4}>
          5. Integration with Third-Party Services
        </Heading>
        <Text mb={6}>
          The App integrates with Dropbox and Google Sheets for added
          functionalities, including job folder creation and job tracking. By
          using these integrations, you agree to comply with the respective
          terms of these services.
        </Text>

        <Heading as="h2" size="lg" color="teal.500" mb={4}>
          6. Intellectual Property
        </Heading>
        <Text mb={6}>
          All content and materials within the App, including design,
          functionality, and code, are the intellectual property of [Your
          Company Name]. Unauthorized use or reproduction of any part of the App
          is prohibited.
        </Text>

        <Heading as="h2" size="lg" color="teal.500" mb={4}>
          7. Disclaimer of Warranties
        </Heading>
        <Text mb={6}>
          The App is provided "as-is" without any warranties of any kind, either
          express or implied. We do not warrant that the App will be error-free
          or uninterrupted.
        </Text>

        <Heading as="h2" size="lg" color="teal.500" mb={4}>
          8. Limitation of Liability
        </Heading>
        <Text mb={6}>
          To the fullest extent permitted by law, [Your Company Name] shall not
          be liable for any direct, indirect, incidental, or consequential
          damages resulting from the use or inability to use the App.
        </Text>

        <Heading as="h2" size="lg" color="teal.500" mb={4}>
          9. Changes to Terms
        </Heading>
        <Text mb={6}>
          We may update these Terms and Conditions from time to time. Any
          changes will be posted within the App, and continued use of the App
          signifies acceptance of those changes.
        </Text>

        <Heading as="h2" size="lg" color="teal.500" mb={4}>
          10. Governing Law
        </Heading>
        <Text mb={6}>
          These Terms shall be governed by the laws of [Your Country/State],
          without regard to its conflict of law provisions.
        </Text>

        <Heading as="h2" size="lg" color="teal.500" mb={4}>
          11. Contact Us
        </Heading>
        <Text mb={6}>
          If you have any questions regarding these Terms, please contact us at{' '}
          <Link color="teal.500" href="mailto:your-email@example.com">
            your-email@example.com
          </Link>
          .
        </Text>
      </Box>

      <Box textAlign="center" mt={10} color="gray.500" fontSize="sm">
        <Footer />
      </Box>
    </Container>
  );
};
