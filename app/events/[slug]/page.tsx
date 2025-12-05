import { notFound } from "next/navigation";
import Image from "next/image";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const EventDetaisPage = async ({params}: {params: Promise<{slug: string}>}) => {
    const {slug} = await params;

    const request = await fetch(`${BASE_URL}/api/events/${slug}`)
    const {event} = await request.json();
    console.log(event.overview)
    if(!event) return notFound();

    return ( 
        <section id="event">
            <div className="header">
                <h1>Event Description</h1>
                <p className="mt-2">{event.description}</p>
                <div className="details">
                    <div className="content">
                        <Image src={event.image} alt="Event baneer" width={800} height={800} className="banner"></Image>
                        <section className="flex-col-gap-2">
                            <h2>Overview</h2>
                            <p>{event.overview}</p>

                        </section>
                        <section className="flex-col-gap-2">
                            <h2>Overview</h2>
                            <p>{event.overview}</p>

                        </section>
                        <section className="flex-col-gap-2">
                            <h2>Overview</h2>
                            <p>{event.overview}</p>

                        </section>
                    
                    </div>


                    <aside className="booking">
                        <p className="test-lg font-semibold">Book Event</p>
                    </aside>
                    
                </div>

            </div>
        </section>
     );
}
 
export default EventDetaisPage;