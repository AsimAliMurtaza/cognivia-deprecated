
import { useState } from 'react';
import { Button, Card, CardBody, Textarea, Box, Heading, Spinner } from '@chakra-ui/react';
// import { generateNotes } from '../util/api';

export default function NoteGenerator() {
  const [input, setInput] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerateNotes = async () => {
    setLoading(true);
    try {
      const generatedNotes = await generateNotes(input);
      setNotes(generatedNotes);
    } catch (error) {
      console.error("Error generating notes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={6}>
      <Card>
        <CardBody>
          <Textarea 
            placeholder="Enter your topic or quiz content here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            size="md"
          />
          <Button 
            mt={4}
            width="100%"
            colorScheme="teal"
            onClick={handleGenerateNotes}
            isDisabled={loading || !input.trim()}
          >
            {loading ? <Spinner size="sm" /> : "Generate Smart Notes"}
          </Button>
        </CardBody>
      </Card>

      {notes && (
        <Card mt={4}>
          <CardBody>
            <Heading as="h2" size="md" mb={2}>Generated Notes:</Heading>
            <Box whiteSpace="pre-wrap">{notes}</Box>
          </CardBody>
        </Card>
      )}
    </Box>
  );
}
