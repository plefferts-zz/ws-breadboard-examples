import logging

board = [['', '', ''], ['', '', ''], ['', '', '']]

connections = []

def main(server):
    def onConnection(connection):
        connections.append(connection)
        connection.send_json({
            'board' : board
        })
        connection.on('set_tile', onSetTile)
        connection.on('connection_closed', onClose)

    def onClose(connection):
        connections.remove(connection)

    def onSetTile(message):
        board[message['y']][message['x']] = message['value']
        for connection in connections:
            connection.send_json({
                'update' : message
            })

    server.on('connection', onConnection)