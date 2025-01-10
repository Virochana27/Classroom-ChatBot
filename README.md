# 01SU22AI000 🎓🤖
*A Classroom Chatbot created by Virochana using Google Dialogflow*

Click this link to access the chatbot on telegram: https://t.me/OISU22AIOOObot

---

## Project Overview 🌟

"01SU22AI000" is an interactive classroom chatbot designed to assist students of the AIML Batch 2022 at Srinivas University. Built using Google Dialogflow and hosted on an Express server, this bot provides essential class-related information, including daily schedules, faculty details, exam schedules and assignment deadlines. Additionally, the bot offers a seamless way to forward complex queries to the Class Representative (CR), making it a useful companion for students’ daily needs.

---

## Key Features 📋

1. **📅 Daily Schedules**
   - Quickly access your class schedule for today, tomorrow, or any specific day of the week.

2. **🧪 Batch-wise Lab Details**
   - Find lab schedules based on your specific batch.

3. **👩‍🏫 Faculty Information**
   - Get the names of faculty members assigned to each subject.

4. **🗓 Submission Deadlines**
   - Check deadlines for assignments, projects, and reports for various subjects.

5. **📩 Contact the Class Representative**
   - Forward questions or concerns to the CR with just a message prompt when the bot cannot answer directly.

6. **❓Fallback Handling**  
   - If the bot cannot answer a question, it will offer to forward the user’s query to the CR, ensuring no questions go unresolved.

---

## Project Structure 📂

- **Dialogflow Agent** 🤖
   
   Configured intents and entities:
  - 🎯**Intents**: Custom intents like "Class Schedule," "Faculty," "Deadlines,","Exams", "Ask Class Representative Intent", "Batch-wise Lab", etc.
  - 🏷️**Entities**: Defined entities like `@day` (representing days of the week), `@Subjects` for subjects and @Exams for exam deatils, etc.

- **server.js** 📜
  
  The main application file where the Express server and webhook logic are implemented. It includes:
  - 🛠️ Intent handling logic for schedule inquiries, faculty, deadlines, exams, CR queries and many such intents.
  - 📧 Nodemailer setup to forward specific queries or message to the CR’s email.
  - 🤖 Telegram Bot integration to forward student messages directly to the Class Representative via chat.
  - ❓ Fallback intent configuration to capture unanswerable queries and prompt CR forwarding.

- **Telegram Bot** 📲
  - Allows users to interact with the chatbot directly via Telegram.
  - The bot responds to questions about schedules, deadlines, and more.
  - Messages can also be forwarded to the CR for additional support.

---

## How to Use 🤔

1. **Start** a conversation by greeting the bot or asking questions about your class.
2. **Ask** about:
   - 📅 Daily schedules: "What's today's schedule?", "When is the next IOT class scheduled?", "Which class is going on?", "What’s the last period tomorrow?", etc.
   - 👨‍🏫 Faculty and subject information: "Which faculty takes IOT class?", "Can you provide the subject code for Deep Learning Techniques?", etc.
   - 🗓️ Deadlines: "What is the deadline for SSCD assignments?", "When should I submit DLT record?", "When is the last day for completing IOT seminar?", etc.
   - 📝 Exams: "When is the next exam?", "When is DWDM exam?", "When is Deep Learning lab exam?", etc.
3. **If unsure**, the bot will ask if you want to forward the question to the Class Representative.
   - ✅ Respond with "Yes" to send the question to the CR, or ❌ "No" to continue with other questions.

---

## References 📚


- YouTube Video 📹: [End-to-End NLP Project | Build a Chatbot in Dialogflow | NLP Tutorial | S3 E2](https://youtu.be/2e5pQqBvGco?si=_0mXBqXlPSTe1T9S)
   
  This video demonstrates the process of building a chatbot for a food delivery website. While it does not cover the specifics of creating a classroom chatbot, it provided me with valuable insights and inspiration that helped shape the foundational ideas for my project.

- Special Thanks to ChatGPT 🤖  
  For providing assistance and guidance throughout the development process.

---

Thank you for visiting this repository! Your classroom assistant is here to make academic life a bit easier. 🎉
