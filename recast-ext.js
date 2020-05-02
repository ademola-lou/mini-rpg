BABYLON.RecastJSPlugin.prototype.constructor = BABYLON.RecastJSPlugin;
        
BABYLON.RecastJSPlugin.prototype.createNavM = function (meshes, parameters) {
        var rc = new this.bjsRECAST.rcConfig();
        rc.cs = parameters.cs;
        rc.ch = parameters.ch;
        rc.borderSize = 0;
        rc.tileSize = 0;
        rc.walkableSlopeAngle = parameters.walkableSlopeAngle;
        rc.walkableHeight = parameters.walkableHeight;
        rc.walkableClimb = parameters.walkableClimb;
        rc.walkableRadius = parameters.walkableRadius;
        rc.maxEdgeLen = parameters.maxEdgeLen;
        rc.maxSimplificationError = parameters.maxSimplificationError;
        rc.minRegionArea = parameters.minRegionArea;
        rc.mergeRegionArea = parameters.mergeRegionArea;
        rc.maxVertsPerPoly = parameters.maxVertsPerPoly;
        rc.detailSampleDist = parameters.detailSampleDist;
        rc.detailSampleMaxError = parameters.detailSampleMaxError;
        this.navMesh = new this.bjsRECAST.NavMesh();
        
        var index;
        var tri;
        var pt;
        var indices = [];
        var positions = [];
        var offset = 0;
        
        //console.log(sphereGeometry.attributes.position.array, sphereGeometry.index.array)
        for (index = 0; index < meshes.length; index++) {
            if (meshes[index]) {
                var mesh = meshes[index];
                var meshIndices = mesh.geometry.index.array;
                 
          
                if (!meshIndices) {
                    continue;
                }
                var meshPositions = mesh.geometry.attributes.position.array;
                if (!meshPositions) {
                    continue;
                }
                mesh.updateMatrixWorld();
                var wm = mesh.matrixWorld
                for (tri = 0; tri < meshIndices.length; tri++) {
                    indices.push(meshIndices[tri] + offset);
                }
                var transformed = new THREE.Vector3(0, 0, 0);
                var position = new THREE.Vector3(0, 0, 0);
                
                for (pt = 0; pt < meshPositions.length; pt += 3) {
                    position.fromArray(meshPositions, pt)
   
                    
                    transformed = position.transformDirection(wm);
                    positions.push(transformed.x, transformed.y, transformed.z);
            // console.log(transformed)
                }
                offset += meshPositions.length / 3;
            }
        }
    //    (positions,positionCount,indices,indexCount,config)
   // console.log("kk", positions)
        this.navMesh.build(mesh.geometry.attributes.position.array, mesh.geometry.attributes.position.counts, mesh.geometry.index.array, mesh.geometry.index.count, rc);
        
      
       }
       
       
        BABYLON.RecastJSPlugin.prototype.createDebugNavyMesh = function (scene) {
        var tri;
        var pt;
        var debugNavMesh = this.navMesh.getDebugNavMesh();
        var triangleCount = debugNavMesh.getTriangleCount();
        var indices = [];
        var positions = [];
        var geometry = new THREE.BufferGeometry();

        for (tri = 0; tri < triangleCount * 3; tri++) {
            indices.push(tri);
        }
        for (tri = 0; tri < triangleCount; tri++) {
            for (pt = 0; pt < 3; pt++) {
                var point = debugNavMesh.getTriangle(tri).getPoint(pt);
                positions.push(new THREE.Vector3(point.x, point.y, point.z));
                  ///geometry.vertices.push(new THREE.Vector3(point.x, point.y, point.z));
            }
        }
        geometry.setFromPoints(positions);
        geometry.setIndex(indices);
        var mesh = new THREE.Mesh(geometry)
        return mesh;
    };
    