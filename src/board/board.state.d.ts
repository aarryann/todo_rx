// microrx.state.d.ts
export interface MRXState {
  board: {
    title: string;
    columns: Column[];
  };
}

export interface Column {
  id?: string | number;
  title: string;
  cards: Card[];
}

export interface Card {
  title: string;
  completed: boolean;
  tags: string[];
}

type Expr =
  | { type: "Literal", value: string | number | boolean | null }
  | { type: "Path", path: string[] }
  | { type: "Binary", op: string, left: Expr, right: Expr }
  | { type: "Unary", op: string, expr: Expr };
