import { createAxiosClient } from "@/clients/axios";

const baseURL = "https://api.openai.com/v1";
const apiKey = process.env.OPENAI_API_KEY || "";

const openAIClient = createAxiosClient(baseURL, apiKey);

const SYSTEM_PROMPT = `
Bạn là một trợ lý chuyên tạo content cho các sự kiện trong hệ thống.

Quy tắc:
- Nhận đầu vào là tên sự kiện (event) và thông tin bổ sung (nếu có).
- Dựa vào event, hãy sinh ra một câu hoặc đoạn văn ngắn phù hợp.
- Luôn viết bằng tiếng Việt, giọng văn thân thiện, tích cực.
- Không được lặp lại nguyên xi các câu đã dùng trước đó, mỗi lần phải có biến thể sáng tạo.
- Nếu gặp event chưa biết, hãy tạo một câu mặc định: "Sự kiện [event] đã diễn ra, chúc bạn thật nhiều niềm vui!"

Event mẫu:
- welcome
- bye
- birthday
- reminder
- congrats
`;

const USER_PROMPT_WELCOME =
    "Tên sự kiện: Welcome, hãy tạo ra câu chào mừng người dùng đến với clan có chứa tên người dùng {user} và tên clan {clan}.";

const USER_PROMPT_GOODBYE =
    "Tên sự kiện: Goodbye, hãy tạo ra câu tạm biệt người dùng đã rời clan, tên clan {clan}. Hãy thêm ở trước câu Ai đó đã rời clan.";

export const getAIWelcomeMessage = async () => {
    try {
        const response = await openAIClient.post("/chat/completions", {
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT,
                },
                {
                    role: "user",
                    content: USER_PROMPT_WELCOME,
                },
            ],
            n: 10,
            temperature: 2,
            top_p: 0.95,
        });

        const randomIndex = Math.floor(
            Math.random() * response.data.choices.length
        );
        const randomMessage =
            response.data.choices[randomIndex].message.content;

        return randomMessage;
    } catch (error) {
        console.error("Error getting generate AI welcome message", error);
    }
};

export const getAIGoodbyeMessage = async () => {
    try {
        const response = await openAIClient.post("/chat/completions", {
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT,
                },
                {
                    role: "user",
                    content: USER_PROMPT_GOODBYE,
                },
            ],
            n: 10,
            temperature: 2,
            top_p: 0.95,
        });

        const randomIndex = Math.floor(
            Math.random() * response.data.choices.length
        );
        const randomMessage =
            response.data.choices[randomIndex].message.content;

        return randomMessage;
    } catch (error) {
        console.error("Error getting generate AI goodbye message", error);
    }
};
