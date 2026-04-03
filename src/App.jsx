import { useState } from 'react'

function App() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'こんにちは。何をお手伝いしましょうか？' }
  ])
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    const newMessages = [...messages, userMessage]

    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('https://backendtest2-drd9aac8e8hxakgb.japaneast-01.azurewebsites.net/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      })

      const data = await response.json()

      setMessages([
        ...newMessages,
        { role: 'assistant', content: data.reply }
      ])
    } catch (error) {
      console.error(error)
      setMessages([
        ...newMessages,
        { role: 'assistant', content: '通信エラーが発生しました。' }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.chatArea}>
        <div style={styles.header}>My Chat UI</div>

        <div style={styles.messages}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.messageRow,
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  ...styles.messageBubble,
                  ...(msg.role === 'user'
                    ? styles.userBubble
                    : styles.assistantBubble),
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div style={styles.messageRow}>
              <div style={{ ...styles.messageBubble, ...styles.assistantBubble }}>
                考え中...
              </div>
            </div>
          )}
        </div>

        <div style={styles.inputArea}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="メッセージを入力してください"
            style={styles.textarea}
            rows={3}
          />
          <button onClick={sendMessage} disabled={loading} style={styles.button}>
            送信
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    backgroundColor: '#f7f7f8',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'sans-serif',
  },
  chatArea: {
    width: '800px',
    height: '90vh',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #ddd',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  header: {
    padding: '16px',
    borderBottom: '1px solid #eee',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  messages: {
    flex: 1,
    padding: '16px',
    overflowY: 'auto',
    backgroundColor: '#fafafa',
  },
  messageRow: {
    display: 'flex',
    marginBottom: '12px',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: '12px 16px',
    borderRadius: '16px',
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap',
  },
  userBubble: {
    backgroundColor: '#dbeafe',
  },
  assistantBubble: {
    backgroundColor: '#f1f5f9',
  },
  inputArea: {
    borderTop: '1px solid #eee',
    padding: '16px',
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-end',
  },
  textarea: {
    flex: 1,
    resize: 'none',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  button: {
    padding: '12px 18px',
    border: 'none',
    borderRadius: '10px',
    backgroundColor: '#111827',
    color: '#fff',
    cursor: 'pointer',
  },
}

export default App