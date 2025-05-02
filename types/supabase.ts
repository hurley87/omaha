export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      hands: {
        Row: {
          token_id: string
          cards: string[]
          decision: string | null
          game_id: number
          player_address: string
        }
        Insert: {
          token_id: string
          cards: string[]
          decision?: string | null
          game_id: number
          player_address: string
        }
        Update: {
          token_id?: string
          cards?: string[]
          decision?: string | null
          game_id?: number
          player_address?: string
        }
      }
    }
    Functions: {
      mint_hand: {
        Args: {
          _player_address: string
          _token_id: string
          _tx_hash: string
        }
        Returns: void
      }
    }
  }
} 