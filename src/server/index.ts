import Board from '../board';
import app from './app';

class Server {
  private board: typeof Board;

  constructor(board: typeof Board) {
    if (!board) throw new Error('No board defiend');
    this.board = board;
  }

  start(port: number, callback: any | undefined) {
    app.listen(port, callback || (() => null));
  }
}

export { Server };
