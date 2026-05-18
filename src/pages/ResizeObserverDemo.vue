<script setup>
import { nextTick, ref } from 'vue'

const box = ref(null)
const result = ref(null)
const error = ref('')
const isObserving = ref(false)

let observer = null

async function runDemo() {
  error.value = ''
  result.value = null

  if (!('ResizeObserver' in window)) {
    error.value = 'Resize Observer API is not supported in this browser.'
    return
  }

  await nextTick()

  if (!box.value) {
    error.value = 'Demo box was not found.'
    return
  }

  if (observer) {
    observer.disconnect()
  }

  observer = new ResizeObserver((entries) => {
    const entry = entries[0]
    const { width, height } = entry.contentRect

    result.value = {
      width: `${Math.round(width)}px`,
      height: `${Math.round(height)}px`,
      updatedAt: new Date().toLocaleTimeString(),
    }
  })

  observer.observe(box.value)
  isObserving.value = true
}
</script>

<template>
  <main class="resize-page">
    <section class="demo-panel">
      <h1>Web API Demo - Resize Observer API</h1>
      <p>
        The Resize Observer API watches an element and reports when its size changes. Click the
        button, then drag the bottom-right corner of the box.
      </p>

      <button type="button" @click="runDemo">
        {{ isObserving ? 'Observing size' : 'Start demo' }}
      </button>

      <div ref="box" class="resize-box">
        Resize me
      </div>

      <div v-if="result" class="message success">
        <strong>Current size</strong>
        <pre>{{ result }}</pre>
      </div>

      <div v-if="error" class="message error">
        <strong>Error</strong>
        <p>{{ error }}</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.resize-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
}

.demo-panel {
  width: min(720px, 100%);
  border: 1px solid #d9e2ec;
  border-radius: 8px;
  padding: 28px;
  background: #ffffff;
  color: #1f2937;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

h1 {
  margin: 0 0 12px;
  color: #111827;
}

p {
  line-height: 1.6;
}

button {
  margin-top: 20px;
  border: 0;
  border-radius: 6px;
  padding: 10px 16px;
  background: #2374ab;
  color: white;
  font-weight: 700;
  cursor: pointer;
}

button:hover {
  background: #185a88;
}

.resize-box {
  width: 260px;
  height: 160px;
  min-width: 180px;
  min-height: 100px;
  max-width: 100%;
  margin-top: 24px;
  resize: both;
  overflow: auto;
  border: 2px dashed #2374ab;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: #e8f3fb;
  color: #155276;
  font-weight: 700;
}

.message {
  margin-top: 20px;
  border-radius: 6px;
  padding: 14px;
}

.success {
  border: 1px solid #9fd8b5;
  background: #effaf3;
}

.error {
  border: 1px solid #f0a3a3;
  background: #fff0f0;
}

pre {
  white-space: pre-wrap;
  margin: 8px 0 0;
  font-family: inherit;
}
</style>
