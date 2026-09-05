from fastapi import Depends,FastAPI
from fastapi.middleware.cors import CORSMiddleware
from model import Product
from database import SessionLocal, engine
import database_model
from sqlalchemy.orm import session


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

database_model.Base.metadata.create_all(engine)

products =[
        Product(id=1, name="Laptop", price=50000.0, qnt= 2),
        Product(id=2, name="Mouse", price=1000.0, qnt=5)
]


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()    

    

def init_db():
    db=SessionLocal()
    count=db.query(database_model.Product).count()

    if count ==0:
        for product in products:
            db.add(database_model.Product(**product.model_dump()))

        db.commit()    

init_db()  



@app.get("/products")
def getAllProduct(db:session = Depends(get_db)):
    db_products = db.query(database_model.Product).all()
    return db_products

@app.get("/product/{id}")
def getById(id:int, db:session = Depends(get_db) ):
    db_product = db.query(database_model.Product).filter(database_model.Product.id == id).first()
    if db_product:
        return db_product
    return "product not found"    

    
@app.post("/product")
def addProduct(product:Product, db:session = Depends(get_db)):
    db.add(database_model.Product(**product.model_dump()))
    db.commit()
    return product


@app.put("/product/{id}")
def update_product(id:int,product:Product, db:session = Depends(get_db)):
    db_product = db.query(database_model.Product).filter(database_model.Product.id == id).first()
    if db_product:
        db_product.name = product.name
        db_product.price = product.price
        db_product.qnt = product.qnt
        db.commit()
        return "product updated"
    else:
         return "product id not found"

   
@app.delete("/product/{id}")
def delete_product(id:int, db:session = Depends(get_db)):
    db_product = db.query(database_model.Product).filter(database_model.Product.id == id).first()
    if db_product:
        db.delete(db_product)
        db.commit()
        return "product deleted"
    else:
        return "product id not found"

