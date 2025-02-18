import { useState } from "react";

type Room = {
    id: number;
    name: string;
    width: number;
    height: number;
    x: number;
    y: number;
};

type Table = {
    id: number;
    x: number;
    y: number;
    seats: number;
    roomId: number;
};

const App = () => {
    const [rooms, setRooms] = useState<Room[]>([
        { id: 1, name: "Основний зал", width: 300, height: 200, x: 50, y: 50 },
    ]);
    const [tables, setTables] = useState<Table[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<number | null>(1);
    const [selectedTable, setSelectedTable] = useState<number | null>(null);
    const [draggingTable, setDraggingTable] = useState<number | null>(null);
    const [draggingRoom, setDraggingRoom] = useState<number | null>(null);

    // Додавання кімнати
    const addRoom = () => {
        setRooms([
            ...rooms,
            {
                id: Date.now(),
                name: `Кімната ${rooms.length + 1}`,
                width: 250,
                height: 180,
                x: 100,
                y: 100,
            },
        ]);
    };

    // Оновлення позиції кімнати
    const updateRoomPosition = (id: number, newX: number, newY: number) => {
        setRooms((prev) =>
            prev.map((room) =>
                room.id === id ? { ...room, x: newX, y: newY } : room
            )
        );
    };

    // Додавання нового столу
    const addTable = () => {
        if (selectedRoom !== null) {
            setTables([
                ...tables,
                { id: Date.now(), x: 150, y: 150, seats: 4, roomId: selectedRoom },
            ]);
        }
    };

    // Оновлення позиції столу
    const updateTablePosition = (id: number, newX: number, newY: number) => {
        setTables((prev) =>
            prev.map((table) =>
                table.id === id ? { ...table, x: newX, y: newY } : table
            )
        );
    };

    // Оновлення кількості місць
    const updateSeats = (id: number, seats: number) => {
        setTables((prev) =>
            prev.map((table) =>
                table.id === id ? { ...table, seats } : table
            )
        );
    };

    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h2>Редактор бару</h2>
            <button onClick={addRoom}>➕ Додати кімнату</button>
            <button onClick={addTable} style={{ marginLeft: "10px" }}>
                ➕ Додати стіл
            </button>

            {selectedTable !== null && (
                <select
                    value={tables.find((t) => t.id === selectedTable)?.seats}
                    onChange={(e) =>
                        updateSeats(selectedTable, parseInt(e.target.value, 10))
                    }
                    style={{ marginLeft: "10px" }}
                >
                    {[2, 4, 6, 8].map((n) => (
                        <option key={n} value={n}>
                            {n} місць
                        </option>
                    ))}
                </select>
            )}

            <svg
                width="800"
                height="500"
                style={{
                    border: "2px solid black",
                    display: "block",
                    margin: "20px auto",
                    backgroundColor: "#f8f8f8",
                }}
                onMouseUp={() => {
                    setDraggingTable(null);
                    setDraggingRoom(null);
                }}
                onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    if (draggingTable !== null) {
                        updateTablePosition(
                            draggingTable,
                            e.clientX - rect.left,
                            e.clientY - rect.top
                        );
                    }
                    if (draggingRoom !== null) {
                        updateRoomPosition(
                            draggingRoom,
                            e.clientX - rect.left,
                            e.clientY - rect.top
                        );
                    }
                }}
            >
                {rooms.map((room) => (
                    <Room
                        key={room.id}
                        {...room}
                        onDragStart={() => setDraggingRoom(room.id)}
                        onSelect={() => setSelectedRoom(room.id)}
                        isSelected={selectedRoom === room.id}
                    />
                ))}

                {tables.map((table) => (
                    <Table
                        key={table.id}
                        {...table}
                        onDragStart={() => setDraggingTable(table.id)}
                        onSelect={() => setSelectedTable(table.id)}
                        isSelected={selectedTable === table.id}
                    />
                ))}
            </svg>
        </div>
    );
};

// Компонент кімнати
const Room = ({
                  id,
                  name,
                  width,
                  height,
                  x,
                  y,
                  onDragStart,
                  onSelect,
                  isSelected,
              }: {
    id: number;
    name: string;
    width: number;
    height: number;
    x: number;
    y: number;
    onDragStart: () => void;
    onSelect: () => void;
    isSelected: boolean;
}) => {
    return (
        <g
            transform={`translate(${x}, ${y})`}
            onMouseDown={onDragStart}
            onClick={onSelect}
            style={{ cursor: "grab" }}
        >
            <rect
                width={width}
                height={height}
                fill={isSelected ? "#FFD700" : "#E0E0E0"}
                stroke="black"
                strokeWidth="2"
            />
            <text
                x={width / 2}
                y="20"
                fontSize="14"
                fill="black"
                textAnchor="middle"
                pointerEvents="none"
            >
                {name}
            </text>
        </g>
    );
};

// Компонент для столу
const Table = ({
                   id,
                   x,
                   y,
                   seats,
                   roomId,
                   onDragStart,
                   onSelect,
                   isSelected,
               }: {
    id: number;
    x: number;
    y: number;
    seats: number;
    roomId: number;
    onDragStart: () => void;
    onSelect: () => void;
    isSelected: boolean;
}) => {
    return (
        <g
            transform={`translate(${x}, ${y})`}
            onMouseDown={onDragStart}
            onClick={onSelect}
            style={{ cursor: "grab" }}
        >
            <rect
                width="60"
                height="60"
                rx="10"
                ry="10"
                fill={isSelected ? "blue" : "gray"}
                stroke="black"
                strokeWidth="2"
            />
            <text
                x="30"
                y="35"
                fontSize="16"
                fill="white"
                textAnchor="middle"
                pointerEvents="none"
            >
                {seats}
            </text>
        </g>
    );
};

export default App;
