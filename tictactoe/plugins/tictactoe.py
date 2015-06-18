import logging, sys

board = [['', '', ''], ['', '', ''], ['', '', '']]

def main(server):
    def onConnection(connection):
        connection.send_json(board)
        connection.on('set_tile', onSetTile)
    
    def onSetTile(message):
        logging.info('message')
        logging.info(message)
        logging.info(message['x'])
        board[message['x']][message['y']] = message['value']

    server.on('connection', onConnection)