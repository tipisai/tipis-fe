import { List } from "antd"
import { FC } from "react"
import TeamCardListItem from "./Item"

const mockData = [
  {
    id: "1",
    title: "Team 1",
    icon: "https://via.placeholder.com/150",
    description: "This is a team",
    tags: ["tag1", "tag2"],
  },
  {
    id: "2",
    title: "Team 2",
    icon: "https://via.placeholder.com/150",
    description: "This is a team",
    tags: ["tag1", "tag2"],
  },
  {
    id: "3",
    title: "Team 3",
    icon: "https://via.placeholder.com/150",
    description: "This is a team",
    tags: ["tag1", "tag2"],
  },
  {
    id: "4",
    title: "Team 4",
    icon: "https://via.placeholder.com/150",
    description: "This is a team",
    tags: ["tag1", "tag2"],
  },
  {
    id: "5",

    title: "Team 5",
    icon: "https://via.placeholder.com/150",
    description: "This is a team",
    tags: ["tag1", "tag2"],
  },
  {
    id: "6",

    title: "Team 6",
    icon: "https://via.placeholder.com/150",
    description: "This is a team",
    tags: ["tag1", "tag2"],
  },
  {
    id: "7",

    title: "Team 7",
    icon: "https://via.placeholder.com/150",
    description: "This is a team",
    tags: ["tag1", "tag2"],
  },
  {
    id: "8",

    title: "Team 8",
    icon: "https://via.placeholder.com/150",
    description: "This is a team",
    tags: ["tag1", "tag2"],
  },
  {
    id: "9",

    title: "Team 9",
    icon: "https://via.placeholder.com/150",
    description: "This is a team",
    tags: ["tag1", "tag2"],
  },
]

const TeamCardList: FC = () => {
  return (
    <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 1,
        md: 1,
        lg: 2,
        xl: 3,
        xxl: 4,
      }}
      dataSource={mockData}
      renderItem={(item, index) => (
        <TeamCardListItem
          icon={item.icon}
          title={item.title}
          description={item.description}
          publishToMarketplace={index % 2 === 0}
          id={item.id}
        />
        // <List.Item>
        //   <TeamCard
        //     icon={item.icon}
        //     title={item.title}
        //     description={item.description}
        //     tags={undefined}
        //     moreButton={
        //       <Button type="text" icon={<Icon component={MoreIcon} />} />
        //     }
        //     editButton={
        //       <>
        //         <Button type="text" icon={<Icon component={PenIcon} />}>
        //           Edit
        //         </Button>
        //         <Button type="text" icon={<Icon component={PlayFillIcon} />}>
        //           Run
        //         </Button>
        //       </>
        //     }
        //   />
        // </List.Item>
      )}
    />
  )
}

export default TeamCardList
