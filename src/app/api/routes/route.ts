import { NextRequest,NextResponse } from "next/server";


/**
 * @swagger
 * /route:
 *   get:
 *     description: Returns hello world
 *     responses:
 *       200:
 *         description: Hello World!
 */
export async function GET(req:NextRequest) {
     try{
        console.log(req.nextUrl.searchParams)
        console.log("Hello world")
        return NextResponse.json({
            message:'Success'
        })
     }catch(error) {

    } 
}

/**
 * @swagger
 * /route:
 *   post:
 *     description: Returns hello world
 *     responses:
 *       200:
 *         description: Hello World!
 */

export async function POST(req:NextRequest) {
    try{
       console.log(req.nextUrl.searchParams)
       console.log("Hello world")
       return NextResponse.json({
           message:'Success'
       })
    }catch(error) {

   } 
}