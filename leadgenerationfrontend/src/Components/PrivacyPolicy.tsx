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

const PrivacyPolicy = () => {
  return (
    <Box py={8} bg="gray.50">
      <Container maxW="container.lg">
        <Heading as="h1" size="xl" mb={6} color="teal.500">
          Privacy Policy
        </Heading>

        <Text fontSize="lg" mb={6}>
          This Privacy Policy explains how [Your Company Name] ("we," "us," or
          "our") collects, uses, and protects information from users of our
          portal application ("the App"). By using the App, you agree to the
          practices described in this policy.
        </Text>

        <Heading as="h2" size="lg" mb={4} color="teal.400">
          1. Introduction
        </Heading>
        <Text fontSize="md" mb={6}>
          We value your privacy and are committed to protecting the personal
          information you share with us. This policy outlines the types of
          information we collect and how it is used and safeguarded.
        </Text>

        <Heading as="h2" size="lg" mb={4} color="teal.400">
          2. Information We Collect
        </Heading>
        <List spacing={3} mb={6}>
          <ListItem>
            <Text fontSize="md">
              <strong>Personal Information:</strong> We may collect employee
              information such as names, email addresses, job details, and any
              other relevant data added to the App.
            </Text>
          </ListItem>
          <ListItem>
            <Text fontSize="md">
              <strong>Job Data:</strong> Job titles, descriptions, deadlines,
              and status updates associated with job entries.
            </Text>
          </ListItem>
          <ListItem>
            <Text fontSize="md">
              <strong>Calendar Data:</strong> Dates related to job schedules and
              events.
            </Text>
          </ListItem>
          <ListItem>
            <Text fontSize="md">
              <strong>Dropbox and Google Sheets:</strong> Data related to job
              folders created in Dropbox and job entries added to Google Sheets.
            </Text>
          </ListItem>
        </List>

        <Heading as="h2" size="lg" mb={4} color="teal.400">
          3. How We Use Information
        </Heading>
        <Text fontSize="md" mb={6}>
          We use the collected information to enhance the functionality of the
          App and to provide you with a better user experience. Here's how:
        </Text>
        <List spacing={3} mb={6}>
          <ListItem>
            <Text fontSize="md">
              <strong>For App Functionality:</strong> To add, update, and manage
              employee and job information within the portal.
            </Text>
          </ListItem>
          <ListItem>
            <Text fontSize="md">
              <strong>Integration Services:</strong> To store files in Dropbox
              and record job information in Google Sheets as requested.
            </Text>
          </ListItem>
          <ListItem>
            <Text fontSize="md">
              <strong>Analytics:</strong> To display statistics and calendar
              events to users within the App for easy tracking of job progress
              and employee metrics.
            </Text>
          </ListItem>
        </List>

        <Heading as="h2" size="lg" mb={4} color="teal.400">
          4. Data Sharing and Disclosure
        </Heading>
        <Text fontSize="md" mb={6}>
          We may share your information with third parties for the purpose of
          providing App functionality, but only to the extent necessary to
          perform those services:
        </Text>
        <List spacing={3} mb={6}>
          <ListItem>
            <Text fontSize="md">
              <strong>Third-Party Services:</strong> We integrate with Dropbox
              and Google Sheets to provide additional functionalities. We only
              share the necessary information to perform these functions, and we
              do not sell any personal information to third parties.
            </Text>
          </ListItem>
          <ListItem>
            <Text fontSize="md">
              <strong>Legal Compliance:</strong> We may disclose information if
              required to comply with applicable laws or legal processes.
            </Text>
          </ListItem>
        </List>

        <Heading as="h2" size="lg" mb={4} color="teal.400">
          5. Data Security
        </Heading>
        <Text fontSize="md" mb={6}>
          We take reasonable measures to protect data from unauthorized access,
          alteration, or destruction. While we strive to secure your
          information, please note that no data transmission over the internet
          is completely secure.
        </Text>

        <Heading as="h2" size="lg" mb={4} color="teal.400">
          6. User Rights
        </Heading>
        <List spacing={3} mb={6}>
          <ListItem>
            <Text fontSize="md">
              <strong>Access and Update:</strong> Users can access and update
              their personal information within the App.
            </Text>
          </ListItem>
          <ListItem>
            <Text fontSize="md">
              <strong>Delete Data:</strong> Users can request the deletion of
              their data, although some information may be retained to fulfill
              our legal obligations.
            </Text>
          </ListItem>
        </List>

        <Heading as="h2" size="lg" mb={4} color="teal.400">
          7. Changes to This Policy
        </Heading>
        <Text fontSize="md" mb={6}>
          We may update this Privacy Policy occasionally. Changes will be posted
          in the App, and your continued use signifies acceptance of any
          updates.
        </Text>

        <Heading as="h2" size="lg" mb={4} color="teal.400">
          8. Contact Us
        </Heading>
        <Text fontSize="md" mb={6}>
          If you have any questions or concerns about this Privacy Policy,
          please contact us at{' '}
          <Link color="teal.300" href="mailto:yourcontactemail@company.com">
            yourcontactemail@company.com
          </Link>
          .
        </Text>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;
