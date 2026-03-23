<template>
  <div class="flex items-center gap-2">
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      type="text"
      :placeholder="placeholder"
      :class="inputClass"
      maxlength="4"
      autocomplete="off"
    />
    <canvas
      ref="canvasRef"
      :width="120"
      :height="40"
      class="rounded-lg cursor-pointer flex-shrink-0 border"
      :class="isDark ? 'border-brand-border' : 'border-gray-300'"
      title="点击刷新验证码"
      @click="refresh"
    />
    <button
      type="button"
      @click="refresh"
      :class="['text-sm whitespace-nowrap', isDark ? 'text-primary hover:text-primary/80' : 'text-blue-600 hover:text-blue-500']"
    >换一张</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useTheme } from '../../composables/useTheme'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  inputClass?: any
}>(), {
  placeholder: '请输入验证码',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'captchaChange': [code: string]
}>()

const { theme } = useTheme()
const isDark = computed(() => theme.value === 'dark')

const canvasRef = ref<HTMLCanvasElement | null>(null)
const currentCode = ref('')

// 随机字符集（去掉容易混淆的字符）
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYabcdefghjkmnpqrstuvwxy3456789'

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)]
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomColor(minV: number, maxV: number, alpha = 1) {
  const r = randomInt(minV, maxV)
  const g = randomInt(minV, maxV)
  const b = randomInt(minV, maxV)
  return `rgba(${r},${g},${b},${alpha})`
}

function drawCaptcha() {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const W = canvas.width
  const H = canvas.height

  // 背景
  const bgColor = isDark.value ? '#0f1a2e' : '#eef4ff'
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, W, H)

  // 生成4位验证码
  let code = ''
  for (let i = 0; i < 4; i++) code += randomChar()
  currentCode.value = code.toLowerCase()
  emit('captchaChange', currentCode.value)

  // 绘制干扰线
  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = randomColor(100, 200, 0.5)
    ctx.lineWidth = randomInt(1, 2)
    ctx.beginPath()
    ctx.moveTo(randomInt(0, W), randomInt(0, H))
    ctx.lineTo(randomInt(0, W), randomInt(0, H))
    ctx.stroke()
  }

  // 绘制干扰点
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = randomColor(100, 200, 0.4)
    ctx.beginPath()
    ctx.arc(randomInt(0, W), randomInt(0, H), 1, 0, Math.PI * 2)
    ctx.fill()
  }

  // 绘制字符
  const colors = ['#00D4FF', '#0066FF', '#00B4D8', '#0096C7', '#0077B6']
  for (let i = 0; i < code.length; i++) {
    const fontSize = randomInt(22, 28)
    ctx.font = `bold ${fontSize}px Arial, sans-serif`
    ctx.fillStyle = isDark.value
      ? colors[i % colors.length]
      : ['#1a56db', '#0066cc', '#0077b6', '#1565c0'][i % 4]
    ctx.save()
    const x = 15 + i * 26
    const y = H / 2 + fontSize / 3
    ctx.translate(x, y)
    ctx.rotate((Math.random() - 0.5) * 0.5)
    ctx.fillText(code[i], 0, 0)
    ctx.restore()
  }

  // 清空输入
  emit('update:modelValue', '')
}

function refresh() {
  drawCaptcha()
}

// 暴露方法供父组件验证
function validate(input: string): boolean {
  return input.toLowerCase() === currentCode.value
}

defineExpose({ refresh, validate, getCode: () => currentCode.value })

onMounted(() => {
  drawCaptcha()
})
</script>
