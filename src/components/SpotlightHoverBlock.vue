<!--
请参阅：
    https://github.com/project-trans/RLE-wiki/discussions/615
    https://nolebase-integrations.ayaka.io/pages/en/integrations/vitepress-plugin-enhanced-readabilities
    https://github.com/nolebase/integrations/tree/main/packages/vitepress-plugin-enhanced-readabilities
本文件修改自：
    https://github.com/nolebase/integrations/blob/main/packages/vitepress-plugin-enhanced-readabilities/src/client/components/SpotlightHoverBlock.vue
-->

<script setup lang="ts">
import {
  useElementBounding,
  useElementByPoint,
  useElementVisibility,
  useEventListener,
  useMouse,
  useMouseInElement,
} from '@vueuse/core'
import {onMounted, reactive, ref, watch} from 'vue'

const props = {enabled: true}

const shouldRecalculate = ref(false)
const boxStyles = ref<Record<string, string | number>>({display: 'none'})
const docElement = ref<HTMLElement>()
const highlightedElement = ref<HTMLElement>()

const {x, y} = useMouse({type: 'client'})
const {isOutside} = useMouseInElement(docElement)
const {element} = useElementByPoint({x, y})
const bounding = reactive(useElementBounding(element))
const elementVisibility = useElementVisibility(highlightedElement)

useEventListener('scroll', bounding.update, true)

function computeBoxStyles(bounding: {
  height: number
  left: number
  top: number
  width: number
}) {
  return {
    display: 'block',
    width: `${bounding.width + 8}px`,
    height: `${bounding.height + 8}px`,
    left: `${bounding.left - 4}px`,
    top: `${bounding.top - 4}px`,
    transition: 'all 0.2s ease',
    borderRadius: '8px',
  }
}

function findChildElementUnderDocElement(element: HTMLElement | null) {
  if (element === null)
    return null

  if (element.parentElement === document.querySelector('.main-pane > main'))
    return element
  else return findChildElementUnderDocElement(element.parentElement)
}

function watchHandler() {
  if (!(element.value && !isOutside.value))
    return

  const el = findChildElementUnderDocElement(element.value)
  highlightedElement.value = el || undefined

  if (highlightedElement.value && highlightedElement.value.tagName === 'P') {
    const val = highlightedElement.value
    const style = window.getComputedStyle(val)
    const lineHeight = Number.parseFloat(style.lineHeight)
    const lines = Math.floor(val.offsetHeight / lineHeight)

    const rect = val.getBoundingClientRect()
    const relativeY = y.value - rect.top

    for (let i = 0; i < lines; i++) {
      const top = i * lineHeight
      const height = lineHeight
      const left = val.offsetLeft
      const width = val.offsetWidth

      if (relativeY >= top && relativeY < top + height) {
        boxStyles.value = computeBoxStyles({
          top: top + rect.top,
          left: left + rect.left,
          width,
          height,
        })

        break
      }
    }
  } else {
    if (highlightedElement.value) {
      const rect = highlightedElement.value.getBoundingClientRect()

      boxStyles.value = computeBoxStyles({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      })
    }
  }
}

onMounted(() => {
  if (!document)
    return
  if (!document.body)
    return

  docElement.value = document.querySelector('.main-pane > main') as HTMLElement
})

watch([x, y], () => {
  if (props.enabled)
    watchHandler()
})

watch(bounding, (val) => {
  if (!props.enabled)
    return

  if (val.width === 0 && val.height === 0)
    boxStyles.value = {display: 'none'}
  else watchHandler()
})

watch(elementVisibility, (val) => {
  if (props.enabled && !val)
    boxStyles.value = {display: 'none'}
})

watch(() => props.enabled, (val) => {
  if (!val)
    boxStyles.value = {display: 'none'}
})
</script>

<template>
  <Teleport to="body">
    <div
        v-if="props.enabled && !shouldRecalculate"
        :style="boxStyles"
        aria-hidden="true"
        class="spotlight-hover-block-aside"
    />
  </Teleport>
</template>

<style scoped>
.spotlight-hover-block-aside {
  pointer-events: none;
  position: fixed;
}

.spotlight-hover-block-aside::before {
  content: '';
  position: absolute;
  display: block;
  width: 4px;
  height: 100%;
  border-radius: 4px;
  background-color: var(--sl-color-accent);
  left: -24px;
}
</style>
