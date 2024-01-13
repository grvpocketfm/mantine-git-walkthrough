"use client";
import * as React from "react";
import { DataTable } from "mantine-datatable";
import { format } from "date-fns";
import { Input, Box, Group, Button, Flex } from "@mantine/core";

const PAGE_SIZE = 10;

export default function HomePage() {
  const [page, setPage] = React.useState(1);
  const [input, setInput] = React.useState<any>(null);
  const [commits, setCommits] = React.useState<any[]>([]);
  const [records, setRecords] = React.useState(commits.slice(0, PAGE_SIZE));

  React.useEffect(() => {
    const fetchScripts = async () => {
      try {
        const response = await fetch("/api/list-commits");
        const data = await response.json();
        console.log(data);
        setCommits(data.commits);
      } catch (error: unknown) {
        if (error instanceof Error) {
          // Now 'error' is recognized as type 'Error'
          console.error(error.message);
        } else {
          console.error("An unknown error occurred:", error);
        }
      }
    };

    fetchScripts();
  }, []);

  React.useEffect(() => {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;
    setRecords(commits.slice(from, to));
  }, [commits, page]);

  const handleHashClick = async (hash: string, message: string) => {
    try {
      const response = await fetch(`/api/switch-to-commit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hash,
          message,
        }),
      });

      const responseData = await response.json();

      console.log(responseData);
      //   if (response.ok) {
      //     const responseData = await response.json();
      //     setResponse(responseData.message);
      //   } else {
      //     console.error('Failed to make POST request');
      //   }
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Now 'error' is recognized as type 'Error'
        console.error(error.message);
      } else {
        console.error("An unknown error occurred:", error);
      }
    }
  };

  console.log({ commits, records });

  return (
    <Box m="md">
      <Flex my="sm" justify="space-between">
        <Button
          variant="filled"
          onClick={() => handleHashClick("master", "Master")}
        >
          Switch to Master
        </Button>

        <Flex direction="row" align="center" gap="lg">
          <Input
            value={input}
            type="number"
            placeholder="Enter Page Number"
            onChange={(e) => setInput(e.target.value)}
          />
          <Button variant="filled" onClick={() => setPage(input)}>
            Click to Jump
          </Button>
        </Flex>
      </Flex>
      <DataTable
        height={300}
        withTableBorder
        records={records}
        columns={[
          {
            accessor: "date",
            textAlign: "right",
            width: 50,
            render: ({ date }) => format(new Date(date), "dd/MM/yyyy"),
          },
          { accessor: "author_name", width: 50 },
          { accessor: "message", width: 200 },
          //   { accessor: "hash", width: 100 },
          {
            accessor: "actions",
            width: "0%",
            title: <Box mx={6}>Row actions</Box>,
            textAlign: "right",
            render: ({ hash, message }) => (
              <Group gap={4} justify="right" wrap="nowrap">
                <Button
                  variant="filled"
                  onClick={() => handleHashClick(hash, message)}
                >
                  Switch to Commit
                </Button>
              </Group>
            ),
          },
        ]}
        totalRecords={commits.length}
        recordsPerPage={PAGE_SIZE}
        page={page}
        onPageChange={(p) => setPage(p)}
        emptyState={() => <></>}
      />
    </Box>
  );
}
