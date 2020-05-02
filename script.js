package hello;


import com.jme3.anim.AnimComposer;
import com.jme3.animation.AnimChannel;
import com.jme3.animation.AnimControl;
import com.jme3.app.SimpleApplication;
import com.jme3.asset.TextureKey;

import com.jme3.export.binary.BinaryExporter;
import com.jme3.light.DirectionalLight;
import com.jme3.material.MatParamTexture;
import com.jme3.material.Material;
import com.jme3.math.ColorRGBA;
import com.jme3.math.Matrix3f;
import com.jme3.math.Vector3f;
import com.jme3.renderer.Camera;
import com.jme3.scene.BatchNode;
import com.jme3.scene.Geometry;
import com.jme3.scene.Node;
import com.jme3.scene.SimpleBatchNode;
import com.jme3.scene.Spatial;
import com.jme3.scene.debug.SkeletonDebugger;
import com.jme3.scene.shape.Box;
import com.jme3.system.AppSettings;
import com.jme3.texture.Texture;
import com.jme3.util.TangentBinormalGenerator;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

public class MyGame extends SimpleApplication {
    protected BatchNode batchNode1;
    protected BatchNode batchNode2;
    protected BatchNode batchNode3;
    protected BatchNode batchNode4;
    protected AnimComposer control;
    protected  Node model;
    float spd;
    public static void main(String[] args){
    	MyGame app = new MyGame();
    	
        app.start(); // start the game
        app.flyCam.isEnabled();
        app.flyCam.setMoveSpeed(3000f);
    }
    
    @Override
    public void simpleInitApp() {
       /*Box b = new Box(1, 1, 1);
        Geometry geom = new Geometry("Box", b);
        Matrix3f matrix3f = new Matrix3f(0, 0, 0, 0, 0, 0, 1, 1, 1);
        geom.setLocalRotation(matrix3f);
        Material mat = new Material(assetManager,
                "Common/MatDefs/Misc/Unshaded.j3md");  // create a simple material
              mat.setColor("Color", ColorRGBA.Blue);   // set color of material to blue
              
        geom.setMaterial(mat);*/
       // rootNode.attachChild(geom);

       /* Spatial myBlenderModel = (Spatial)assetManager.loadModel("Models/model.obj");
        BinaryExporter exporter = BinaryExporter.getInstance();
        File myJMEModel = new File("path/to/Models/myJMEModel.j3o");
        try {
            exporter.save(myBlenderModel, myJMEModel);
        } catch (IOException ex) {
            System.exit(0);
        }*/
    	
    	
    	
        Material mat2 = new Material(assetManager,
                "Common/MatDefs/Light/Lighting.j3md");  // create a simple material

    
      model = (Node)assetManager.loadModel("recynthia.glb");
        
	    model.depthFirstTraversal((Spatial spatial) -> {
	    	
	    	 if(spatial.getName().equalsIgnoreCase("armature")) {
	    		
	    		/*  control = spatial.getControl(AnimComposer.class);
		          if(control != null) {
		           //	control.update(tpf);
			            System.out.print(control.getAnimClipsNames());
			            
			            }*/
	    		 
	    	 }
	          if(spatial instanceof Geometry) {
	        	
	        	  Geometry spatialGeom = (Geometry) spatial;
	        	  Material jaimeMaterial = spatialGeom.getMaterial();
	              MatParamTexture textre = jaimeMaterial.getTextureParam("BaseColorMap");
	              mat2.setBoolean("UseMaterialColors", true);
	      		    mat2.setColor("Diffuse", new ColorRGBA(1f, 1f, 1f, 1f));
	              mat2.setTexture("DiffuseMap", textre.getTextureValue());
	              spatial.setMaterial(mat2);
	              spatial.scale(2, 2, 2);
	              
	              
	              
	              
	            
	        	  //System.out.println(spatialGeom.getMaterial().getParams());
	          }
	      }, Spatial.DFSMode.PRE_ORDER);
	      this.rootNode.attachChild(model);
	      
       // rootNode.attachChildAt(model, 0);
       /* BinaryExporter exporter = BinaryExporter.getInstance();
        File myJMEModel = new File("bin/Cynthia.j3o");
        try {
            exporter.save(model, myJMEModel);
        } catch (IOException ex) {
            System.exit(0);
        }*/
        
	      DirectionalLight sun = new DirectionalLight();
	        sun.setDirection(new Vector3f(-0.1f, -0.7f, -1.0f));
	       
        sun.setColor(ColorRGBA.White.mult(10f));
        rootNode.addLight(sun);

    }
    
    @Override
    public void simpleUpdate(float tpf) {
        // make the player rotate:
    	/* model.breadthFirstTraversal(sp -> {
	         
   		 });*/
    	
    }

}
