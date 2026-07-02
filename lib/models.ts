export type Model = {
  chef: string
  chefSlug: string
  id: string
  name: string
}

export const MODELS: Model[] = [
  {
    chef: "DeepSeek",
    chefSlug: "deepseek",
    id: "deepseek/deepseek-v4-flash",
    name: "DeepSeek V4 Flash",
  },
  {
    chef: "Xiaomi",
    chefSlug: "xiaomi",
    id: "xiaomi/mimo-v2.5",
    name: "MiMo V2.5",
  },
  {
    chef: "Alibaba",
    chefSlug: "alibaba",
    id: "alibaba/qwen3.6-plus",
    name: "Qwen3.6 Plus",
  },
  {
    chef: "MiniMax",
    chefSlug: "minimax",
    id: "minimax/minimax-m3",
    name: "MiniMax M3",
  },
]

export const CHEFS = [...new Set(MODELS.map((m) => m.chef))]

export const DEFAULT_MODEL_ID = MODELS[0].id
