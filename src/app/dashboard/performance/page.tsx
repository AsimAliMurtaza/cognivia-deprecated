// app/dashboard/performance/page.tsx
"use client";

import { Card, CardHeader, CardBody, Heading, Text } from "@chakra-ui/react";

export default function PerformancePage() {
  return (
    <Card>
      <CardHeader>
        <Heading size="md">Performance Page</Heading>
      </CardHeader>
      <CardBody>
        <Text>This is the Performance page.</Text>
      </CardBody>
    </Card>
  );
}
