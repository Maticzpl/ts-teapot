import {Vertex} from "./vertex.js";

export class STLModel {
    private data: Uint8Array | undefined;
    loaded: Promise<void>;

    constructor(uri: string) {
        const req = new XMLHttpRequest();
        req.open("GET", uri, true);
        req.responseType = "arraybuffer";
  
        this.loaded = new Promise((res: (value: void) => void, rej) => {
            req.onload = (event) => {
                const arrayBuffer = req.response;
                if (arrayBuffer) {
                    this.data = new Uint8Array(arrayBuffer);
                    console.log(`STL Model ${uri} loaded`);                            
                }
                res();
            };
        });
        
        req.send(null);
    }

    parseTriangles(): Vertex[] {
        if (this.data === undefined) 
            throw "No data";

        let trigNum: number = 0;

        // 80 byte header
        trigNum |= this.data[80] << 0;
        trigNum |= this.data[81] << 8;
        trigNum |= this.data[82] << 16;
        trigNum |= this.data[83] << 24;
        
        let verts: Vertex[] = [];
        let view = new DataView(this.data.buffer);

        let currentTrig = 0;
        let i = 84;
        while (currentTrig++ < trigNum) {
            let normalVec = [view.getFloat32(i, true), view.getFloat32(i + 4, true), view.getFloat32(i + 8, true)];
            i += 3 * 4;

            for (let j = 0; j < 3; j++) {
                let vert: Vertex = { pos: [0, 0, 0], uv: [0, 0], normal: [normalVec[0], normalVec[1], normalVec[2]] };
                vert.pos = [view.getFloat32(i, true), view.getFloat32(i + 4, true), view.getFloat32(i + 8, true)];
                verts.push(vert);
                vert.uv = [vert.pos[0] / 5.0, vert.pos[1] / 5.0];
                i += 3 * 4;                
            }
            
            i += 2; //attribute count thing        

        }

        return verts;
    }
}