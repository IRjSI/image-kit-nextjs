import { authOptions } from "@/lib/auth";
import { connectToDb } from "@/lib/db";
import Video from "@/model/video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDb();
        const videos = await Video.find({});
        if (!videos || videos.length === 0) {
            return NextResponse.json([], { status: 200 })
        }

        return NextResponse.json(videos);

    } catch (error) {
        return NextResponse.json(
            { error: "server error (getting videos)" },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: "unauthorized to post videos" },
                { status: 401 }
            )
        }
        
        await connectToDb();

        const body = await request.json();
        if (!body.title || !body.description || !body.videoUrl || !body.thumbnailUrl) {
            return NextResponse.json(
                { error: "missing fields (video upload)" },
                { status: 500 }
            )
        }

        const videoData = {
            ...body,
            controls: body?.controls ?? true,
            transformation: {
                height: 1920,
                width: 1080,
                quality: body?.transformation.quality ?? 100
            }
        };
        const newVideo = await Video.create(videoData)

        return NextResponse.json(newVideo);
    } catch (error) {
        return NextResponse.json(
            { error: "server error (video post)" },
            { status: 500 }
        )
    }
}