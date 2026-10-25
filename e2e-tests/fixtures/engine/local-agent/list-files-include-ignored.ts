import type { LocalAgentFixture } from "../../../../testing/fake-llm-server/localAgentTypes";

export const fixture: LocalAgentFixture = {
  description: "List files including ignored .nextbillion files",
  turns: [
    {
      text: "I'll list all files including the ignored .nextbillion directory for you.",
      toolCalls: [
        {
          name: "list_files",
          args: {
            directory: ".nextbillion",
            recursive: true,
            include_ignored: true,
          },
        },
      ],
    },
    {
      text: "Here are the ignored .nextbillion files.",
    },
  ],
};
