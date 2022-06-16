import levelMap from "./LevelMap";

export type roomCoords = {
    x: number,
    y: number,
    width: number,
    height: number;
}

export type point = {
    x: number,
    y: number
};

export class Leaf {
    x: number;
    y: number;
    width: number;
    height: number;
    leftChild!: Leaf;
    rightChild!: Leaf;
    MIN_LEAF_SIZE: number;
    room!: roomCoords;
    halls!: number[];
    levelMap: string[][];

    constructor(intX: number, intY: number, intWidth: number, intHeight: number, minLeafSize: number, currentLevel: string[][]) {
        this.x = intX;
        this.y = intY;
        this.width = intWidth;
        this.height = intHeight;
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
            if (this.leftChild && this.rightChild)
            {
                this.createHall(this.leftChild.getRoom(), this.rightChild.getRoom());
            }

        } else {
            // this Leaf is ready to make a room

            // the room can be between 3 x 3 tiles to the size of the leaf - 2.
            let roomSize = {width: this.getRandom(3, this.width - 2), height: this.getRandom(3, this.height - 2)};
            //console.log(roomSize);

            // place the room within the Leaf, but don't put it right against the side of the Leaf (that would merge rooms together)
            let roomPos = {
                x: this.getRandom(1, this.width - roomSize.width - 1),
                y: this.getRandom(1, this.height - roomSize.height - 1)
            };

            this.room = {x: this.x + roomPos.x, y: this.y + roomPos.y, width: roomSize.width, height: roomSize.height};
            this.changeMapCharacters(this.room.x, this.room.y, this.room.width, this.room.height, ' ');
        }
    }

    changeMapCharacters(x: number, y: number, width: number, height: number, character: string) {
        // added later to fill out a passed in array for displaying purposes
        for (let i = x; i < x + width; i++) {
            for (let j = y; j < y + height; j++) {
                try {
                    this.levelMap[j][i] = character;
                } catch (error) {
                    console.log(x, y, width, height, error);
                }
            }
        }
    }

    getRandom(minRandom: number, maxRandom: number) {
        return Math.floor(Math.random() * (maxRandom - minRandom + 1)) + minRandom;
    }

    getRoom(): roomCoords | null {
        if(this.room) {
            return this.room;
        } else {
            let leftRoom: roomCoords | null = null;
            let rightRoom: roomCoords | null = null;

            if(this.leftChild) {
                leftRoom = this.leftChild.getRoom();
            }

            if(this.rightChild) {
                rightRoom = this.rightChild.getRoom();
            }

            if(!leftRoom && !rightRoom) {
                return null;
            } else if(!rightRoom) {
                return leftRoom;
            } else if(!leftRoom) {
                return rightRoom;
            } else if(Math.random() > 0.5) {
                return leftRoom;
            } else {
                return rightRoom;
            }
        }
    }

    createHall(l: roomCoords | null, r: roomCoords | null) {
        // now we connect these two rooms together with hallways.
        // this looks pretty complicated, but it's just trying to figure out which point is where and then either draw a straight line, or a pair of lines to make a right-angle to connect them.
        // you could do some extra logic to make your halls more bendy, or do some more advanced things if you wanted.

        const halls: roomCoords[] = [];

        const point1 = {
            x: this.getRandom(l!.x + 1, l!.x + l!.width - 2),
            y: this.getRandom(l!.y + 1, l!.y + l!.height - 2)
        };

        const point2 = {
            x: this.getRandom(r!.x + 1, r!.x + r!.width - 2),
            y: this.getRandom(r!.y + 1, r!.y + r!.height - 2)
        };

        const w: number = point2.x - point1.x;
        const h: number = point2.y - point1.y;

        if (w < 0)
        {
            if (h < 0)
            {
                if (Math.random() < 0.5)
                {
                    halls.push({x: point2.x, y: point1.y, width: Math.abs(w), height: 1});
                    halls.push({x: point2.x, y: point2.y, width: 1, height: Math.abs(h)});
                }
                else
                {
                    halls.push({x: point2.x, y: point2.y, width: Math.abs(w), height: 1});
                    halls.push({x: point1.x, y: point2.y, width: 1, height: Math.abs(h)});
                }
            }
            else if (h > 0)
            {
                if (Math.random() < 0.5)
                {
                    halls.push({x: point2.x, y: point1.y, width: Math.abs(w), height: 1});
                    halls.push({x: point2.x, y: point1.y, width: 1, height: Math.abs(h)});
                }
                else
                {
                    halls.push({x: point2.x, y: point2.y, width: Math.abs(w), height: 1});
                    halls.push({x: point1.x, y: point1.y, width: 1, height: Math.abs(h)});
                }
            }
            else // if (h == 0)
            {
                halls.push({x: point2.x, y: point2.y, width: Math.abs(w), height: 1});
            }
        }
        else if (w > 0)
        {
            if (h < 0)
            {
                if (Math.random() < 0.5)
                {
                    halls.push({x: point1.x, y: point2.y, width: Math.abs(w), height: 1});
                    halls.push({x: point1.x, y: point2.y, width: 1, height: Math.abs(h)});;
                }
                else
                {
                    halls.push({x: point1.x, y: point1.y, width: Math.abs(w), height: 1});
                    halls.push({x: point2.x, y: point2.y, width: 1, height: Math.abs(h)});
                }
            }
            else if (h > 0)
            {
                if (Math.random() < 0.5)
                {
                    halls.push({x: point1.x, y: point1.y, width: Math.abs(w), height: 1});
                    halls.push({x: point2.x, y: point1.y, width: 1, height: Math.abs(h)});
                }
                else
                {
                    halls.push({x: point1.x, y: point2.y, width: Math.abs(w), height: 1});
                    halls.push({x: point1.x, y: point1.y, width: 1, height: Math.abs(h)});
                }
            }
            else // if (h == 0)
            {
                halls.push({x: point1.x, y: point1.y, width: Math.abs(w), height: 1});
            }
        }
        else // if (w == 0)
        {
            if (h < 0)
            {
                halls.push({x: point2.x, y: point2.y, width: 1, height: Math.abs(h)});
            }
            else if (h > 0)
            {
                halls.push({x: point1.x, y: point1.y, width: 1, height: Math.abs(h)});
            }
        }

        for (const eachHall of halls) {
            this.changeMapCharacters(eachHall.x, eachHall.y, eachHall.width, eachHall.height, ' ');
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

        if ((this.width > this.height) && (this.width / this.height >= 1.25)) {
            splitHeight = false;
        } else if ((this.height > this.width) && (this.height / this.width >= 1.25)) {
            splitHeight = true;
        }

        // determine max height or width depending on splitHeight
        let max: number = (splitHeight ? this.height : this.width) - this.MIN_LEAF_SIZE;

        if (max <= this.MIN_LEAF_SIZE) {
            return false; // too small to split more
        }

        // randomly decide where to split this leaf
        const split: number = this.getRandom(this.MIN_LEAF_SIZE, max);

        // create left and right children depending on direction of the split
        if (splitHeight) {
            this.leftChild = new Leaf(this.x, this.y, this.width, split, this.MIN_LEAF_SIZE, this.levelMap);
            this.rightChild = new Leaf(this.x, this.y + split, this.width, this.height - split, this.MIN_LEAF_SIZE, this.levelMap);
        } else {
            this.leftChild = new Leaf(this.x, this.y, split, this.height, this.MIN_LEAF_SIZE, this.levelMap);
            this.rightChild = new Leaf(this.x + split, this.y, this.width - split, this.height, this.MIN_LEAF_SIZE, this.levelMap);
        }

        return true;
    }
}