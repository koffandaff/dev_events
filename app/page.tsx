import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { IEvent } from "@/database";
import { events } from "@/lib/constants";

const BASE_URl = process.env.NEXT_PUBLIC_BASE_URL
const Page = async () => {
  const response = await fetch(`${BASE_URl}/api/events`)
  console.log(response)
  const {events} = await response.json()
  console.log(events)
  return (  
    <section>
      <h1  className="text-center">THe Hub for every Dev <br/> Event You Can't Miss</h1>

       
      <p className="text-center mt-5">Hackathons, Meetups and Confrences, All in One Place</p>
      
      
      <ExploreBtn />

      <div className="mt-20 space-y-7">
          <h3>Featured Events</h3>

          <ul className="events">
              {events && events.length > 0 && events.map((event: IEvent) => (
                <li key={event.title}> 
                <EventCard {...event}/>
                </li>
              ))}
          </ul>
      </div>
    </section>
  );
}
 
export default Page;