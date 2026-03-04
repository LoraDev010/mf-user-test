/**
 * Manual mock for motion/react.
 * Replaces animated components with plain HTML equivalents so Jest/jsdom
 * does not choke on the ESM-only motion package.
 */
import React from 'react'

type AnyProps = Record<string, unknown>

function strip(props: AnyProps) {
  // Remove motion-specific props that would cause DOM warnings
  const {
    initial, animate, exit, transition, whileHover, whileTap, whileFocus,
    layout, layoutId, variants, custom, onAnimationStart, onAnimationComplete,
    ...rest
  } = props
  void initial; void animate; void exit; void transition; void whileHover
  void whileTap; void whileFocus; void layout; void layoutId; void variants
  void custom; void onAnimationStart; void onAnimationComplete
  return rest
}

const createEl =
  (tag: string) =>
  // eslint-disable-next-line react/display-name
  React.forwardRef(({ children, ...props }: AnyProps & { children?: React.ReactNode }, ref: React.Ref<unknown>) =>
    React.createElement(tag, { ...strip(props), ref }, children),
  )

export const motion = {
  div: createEl('div'),
  span: createEl('span'),
  button: createEl('button'),
  article: createEl('article'),
  section: createEl('section'),
  nav: createEl('nav'),
  ul: createEl('ul'),
  li: createEl('li'),
  p: createEl('p'),
  h1: createEl('h1'),
  h2: createEl('h2'),
  h3: createEl('h3'),
  img: createEl('img'),
}

export const AnimatePresence = ({
  children,
}: {
  children?: React.ReactNode
}) => <>{children}</>

export default motion
