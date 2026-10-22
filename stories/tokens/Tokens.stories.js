import TokenColors from '../../src/docs/TokenColors.vue'
import TokenType from '../../src/docs/TokenType.vue'
import TokenGlass from '../../src/docs/TokenGlass.vue'
import TokenLayout from '../../src/docs/TokenLayout.vue'
import MotionTokens from '../../src/docs/MotionTokens.vue'
import AnimationLab from '../../src/docs/AnimationLab.vue'

export default { title: 'Tokens', parameters: { layout: 'fullscreen' } }

const page = (component) => ({ render: () => ({ components: { C: component }, template: '<div style="padding:16px"><C /></div>' }) })

export const Colors = page(TokenColors)
export const Typography = page(TokenType)
export const Glass = page(TokenGlass)
export const SpacingRadiiShadows = { ...page(TokenLayout), name: 'Spacing, radii, shadows' }
export const Motion = page(MotionTokens)
export const AnimationLabStory = { ...page(AnimationLab), name: 'Animation Lab' }
