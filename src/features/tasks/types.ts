export type TaskStatus = "OPEN" | "IN_PROGRESS" | "DONE";

export type Task = {
  id: number;
  title: string;
  status: TaskStatus;
  user_id?: number;
};
