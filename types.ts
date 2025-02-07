export interface ModelOutput {
  model_id: string
  text: string
}

export interface Comparison {
  comparison_id: string
  output_id: string
  model_outputs: ModelOutput[]
  comment?: string
}

