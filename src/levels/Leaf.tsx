import getRandom from "../libraries/getRandom";

export type RoomCoords = {
    rowNumber: number,
    columnNumber: number,
    rows: number,
    columns: number;
}

export type Point = {
    rowNumber: number,
    columnNumber: number
};

export class Leaf {
    rowNumber: number;
    columnNumber: number;
    rows: number;
    columns: number;
    leftChild!: Leaf;
    rightChild!: Leaf;
    MIN_LEAF_SIZE: number;
    room!: RoomCoords;
    halls!: number[];
    levelMap: string[][];

    constructor(intRowNumber: number, intColumnNumber: number, numRows: number, intColumns: number, minLeafSize: number, currentLevel: string[][]) {
        this.rowNumber = intRowNumber;
        this.columnNumber = intColumnNumber;
        this.rows = numRows;
        this.columns = intColumns;
        this.MIN_LEAF_SIZE = minLeafSize;
        this.levelMap = currentLevel;
    }

    createRooms() {
        // this function generates all the rooms and hallways for this Leaf and all of its children.
        if (this.leftChild || this.rightChild) {
            // this leaf has been split, so go into the children leafs
            if (this.leftChild) {
                this.leftChild.createRooms();
            }

            if (this.rightChild) {
                this.rightChild.createRooms();
            }

            // if there are both left and right children in this Leaf, create a hallway between them
            if (this.leftChild && this.rightChild) {
                this.createHall(this.leftChild.getRoom(), this.rightChild.getRoom());
            }

        } else {
            // this Leaf is ready to make a room

            // the room can be between 3 x 3 tiles to the size of the leaf - 2.
            let roomSize = {width: getRandom(3, this.rows - 2), columns: getRandom(3, this.columns - 2)};
            //console.log(roomSize);

            // place the room within the Leaf, but don't put it right against the side of the Leaf (that would merge rooms together)
            let roomPos = {
                rowNumber: getRandom(1, this.rows - roomSize.width - 1),
                columnNumber: getRandom(1, this.columns - roomSize.columns - 1)
            };

            this.room = {
                rowNumber: this.rowNumber + roomPos.rowNumber,
                columnNumber: this.columnNumber + roomPos.columnNumber,
                rows: roomSize.width,
                columns: roomSize.columns
            };
            this.changeMapCharacters(this.room.rowNumber, this.room.columnNumber, this.room.rows, this.room.columns, ' ');
        }
    }

    changeMapCharacters(rowNumber: number, columnNumber: number, width: number, columns: number, character: string) {
        // added later to fill out a passed in array for displaying purposes
        for (let i = rowNumber; i < rowNumber + width; i++) {
            for (let j = columnNumber; j < columnNumber + columns; j++) {
                try {
                    this.levelMap[i][j] = character;
                } catch (error) {
                    console.log(rowNumber, columnNumber, width, columns, error);
                }
            }
        }
    }

    // getRandom(minRandom: number, maxRandom: number) {
    //     return Math.floor(Math.random() * (maxRandom - minRandom + 1)) + minRandom;
    // }

    getRoom(): RoomCoords | null {
        if (this.room) {
            return this.room;
        } else {
            let leftRoom: RoomCoords | null = null;
            let rightRoom: RoomCoords | null = null;

            if (this.leftChild) {
                leftRoom = this.leftChild.getRoom();
            }

            if (this.rightChild) {
                rightRoom = this.rightChild.getRoom();
            }

            if (!leftRoom && !rightRoom) {
                return null;
            } else if (!rightRoom) {
                return leftRoom;
            } else if (!leftRoom) {
                return rightRoom;
            } else if (Math.random() > 0.5) {
                return leftRoom;
            } else {
                return rightRoom;
            }
        }
    }

    createHall(l: RoomCoords | null, r: RoomCoords | null) {
        // now we connect these two rooms together with hallways.
        // this looks pretty complicated, but it's just trying to figure out which point is where and then either draw a straight line, or a pair of lines to make a right-angle to connect them.
        // you could do some extra logic to make your halls more bendy, or do some more advanced things if you wanted.

        const halls: RoomCoords[] = [];

        const point1 = {
            rowNumber: getRandom(l!.rowNumber + 1, l!.rowNumber + l!.rows - 2),
            columnNumber: getRandom(l!.columnNumber + 1, l!.columnNumber + l!.columns - 2)
        };

        const point2 = {
            rowNumber: getRandom(r!.rowNumber + 1, r!.rowNumber + r!.rows - 2),
            columnNumber: getRandom(r!.columnNumber + 1, r!.columnNumber + r!.columns - 2)
        };

        const w: number = point2.rowNumber - point1.rowNumber;
        const h: number = point2.columnNumber - point1.columnNumber;

        if (w < 0) {
            if (h < 0) {
                if (Math.random() < 0.5) {
                    halls.push({
                        rowNumber: point2.rowNumber,
                        columnNumber: point1.columnNumber,
                        rows: Math.abs(w),
                        columns: 1
                    });
                    halls.push({
                        rowNumber: point2.rowNumber,
                        columnNumber: point2.columnNumber,
                        rows: 1,
                        columns: Math.abs(h)
                    });
                } else {
                    halls.push({
                        rowNumber: point2.rowNumber,
                        columnNumber: point2.columnNumber,
                        rows: Math.abs(w),
                        columns: 1
                    });
                    halls.push({
                        rowNumber: point1.rowNumber,
                        columnNumber: point2.columnNumber,
                        rows: 1,
                        columns: Math.abs(h)
                    });
                }
            } else if (h > 0) {
                if (Math.random() < 0.5) {
                    halls.push({
                        rowNumber: point2.rowNumber,
                        columnNumber: point1.columnNumber,
                        rows: Math.abs(w),
                        columns: 1
                    });
                    halls.push({
                        rowNumber: point2.rowNumber,
                        columnNumber: point1.columnNumber,
                        rows: 1,
                        columns: Math.abs(h)
                    });
                } else {
                    halls.push({
                        rowNumber: point2.rowNumber,
                        columnNumber: point2.columnNumber,
                        rows: Math.abs(w),
                        columns: 1
                    });
                    halls.push({
                        rowNumber: point1.rowNumber,
                        columnNumber: point1.columnNumber,
                        rows: 1,
                        columns: Math.abs(h)
                    });
                }
            } else // if (h == 0)
            {
                halls.push({
                    rowNumber: point2.rowNumber,
                    columnNumber: point2.columnNumber,
                    rows: Math.abs(w),
                    columns: 1
                });
            }
        } else if (w > 0) {
            if (h < 0) {
                if (Math.random() < 0.5) {
                    halls.push({
                        rowNumber: point1.rowNumber,
                        columnNumber: point2.columnNumber,
                        rows: Math.abs(w),
                        columns: 1
                    });
                    halls.push({
                        rowNumber: point1.rowNumber,
                        columnNumber: point2.columnNumber,
                        rows: 1,
                        columns: Math.abs(h)
                    });

                } else {
                    halls.push({
                        rowNumber: point1.rowNumber,
                        columnNumber: point1.columnNumber,
                        rows: Math.abs(w),
                        columns: 1
                    });
                    halls.push({
                        rowNumber: point2.rowNumber,
                        columnNumber: point2.columnNumber,
                        rows: 1,
                        columns: Math.abs(h)
                    });
                }
            } else if (h > 0) {
                if (Math.random() < 0.5) {
                    halls.push({
                        rowNumber: point1.rowNumber,
                        columnNumber: point1.columnNumber,
                        rows: Math.abs(w),
                        columns: 1
                    });
                    halls.push({
                        rowNumber: point2.rowNumber,
                        columnNumber: point1.columnNumber,
                        rows: 1,
                        columns: Math.abs(h)
                    });
                } else {
                    halls.push({
                        rowNumber: point1.rowNumber,
                        columnNumber: point2.columnNumber,
                        rows: Math.abs(w),
                        columns: 1
                    });
                    halls.push({
                        rowNumber: point1.rowNumber,
                        columnNumber: point1.columnNumber,
                        rows: 1,
                        columns: Math.abs(h)
                    });
                }
            } else // if (h == 0)
            {
                halls.push({
                    rowNumber: point1.rowNumber,
                    columnNumber: point1.columnNumber,
                    rows: Math.abs(w),
                    columns: 1
                });
            }
        } else // if (w == 0)
        {
            if (h < 0) {
                halls.push({
                    rowNumber: point2.rowNumber,
                    columnNumber: point2.columnNumber,
                    rows: 1,
                    columns: Math.abs(h)
                });
            } else if (h > 0) {
                halls.push({
                    rowNumber: point1.rowNumber,
                    columnNumber: point1.columnNumber,
                    rows: 1,
                    columns: Math.abs(h)
                });
            }
        }

        for (const eachHall of halls) {
            this.changeMapCharacters(eachHall.rowNumber, eachHall.columnNumber, eachHall.rows, eachHall.columns, ' ');
        }
    }

    splitLeaf() {
        if (this.leftChild || this.rightChild) {
            // already split, don't want to do it again
            return false;
        }

        // determine direction of split
        // if width is > 25% larger than height, split vertically (false)
        // if height is > 25% larger than width, split horizontally (true)
        // otherwise default to random split
        let splitHeight: boolean = (Math.random() > 0.5);

        if ((this.rows > this.columns) && (this.rows / this.columns >= 1.25)) {
            splitHeight = false;
        } else if ((this.columns > this.rows) && (this.columns / this.rows >= 1.25)) {
            splitHeight = true;
        }

        // determine max columns or width depending on splitHeight
        let max: number = (splitHeight ? this.columns : this.rows) - this.MIN_LEAF_SIZE;

        if (max <= this.MIN_LEAF_SIZE) {
            return false; // too small to split more
        }

        // randomly decide where to split this leaf
        const split: number = getRandom(this.MIN_LEAF_SIZE, max);

        // create left and right children depending on direction of the split
        if (splitHeight) {
            this.leftChild = new Leaf(this.rowNumber, this.columnNumber, this.rows, split, this.MIN_LEAF_SIZE, this.levelMap);
            this.rightChild = new Leaf(this.rowNumber, this.columnNumber + split, this.rows, this.columns - split, this.MIN_LEAF_SIZE, this.levelMap);
        } else {
            this.leftChild = new Leaf(this.rowNumber, this.columnNumber, split, this.columns, this.MIN_LEAF_SIZE, this.levelMap);
            this.rightChild = new Leaf(this.rowNumber + split, this.columnNumber, this.rows - split, this.columns, this.MIN_LEAF_SIZE, this.levelMap);
        }

        return true;
    }
}