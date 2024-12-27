import { PostTypes } from "@/types";


export const dummyMedia = [
    { "id": 1, "type": "image", "url": "https://picsum.photos/300/200?random=1" },
    { "id": 2, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_2mb.mp4", "duration": "3 sec" },
    { "id": 3, "type": "image", "url": "https://picsum.photos/300/200?random=2" },
    { "id": 4, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_5mb.mp4", "duration": "5 sec" },
    { "id": 5, "type": "image", "url": "https://picsum.photos/300/200?random=3" },
    { "id": 6, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4", "duration": "2 sec" },
    { "id": 7, "type": "image", "url": "https://picsum.photos/300/200?random=4" },
    { "id": 8, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_3mb.mp4", "duration": "4 sec" },
    { "id": 9, "type": "image", "url": "https://picsum.photos/300/200?random=5" },
    { "id": 10, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_4mb.mp4", "duration": "5 sec" },
    { "id": 11, "type": "image", "url": "https://picsum.photos/300/200?random=6" },
    { "id": 12, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_2mb.mp4", "duration": "2 sec" },
    { "id": 13, "type": "image", "url": "https://picsum.photos/300/200?random=7" },
    { "id": 14, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_3mb.mp4", "duration": "3 sec" },
    { "id": 15, "type": "image", "url": "https://picsum.photos/300/200?random=8" },
    { "id": 16, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_5mb.mp4", "duration": "5 sec" },
    { "id": 17, "type": "image", "url": "https://picsum.photos/300/200?random=9" },
    { "id": 18, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4", "duration": "2 sec" },
    { "id": 19, "type": "image", "url": "https://picsum.photos/300/200?random=10" },
    { "id": 20, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_4mb.mp4", "duration": "4 sec" },
    { "id": 21, "type": "image", "url": "https://picsum.photos/300/200?random=11" },
    { "id": 22, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_3mb.mp4", "duration": "3 sec" },
    { "id": 23, "type": "image", "url": "https://picsum.photos/300/200?random=12" },
    { "id": 24, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_2mb.mp4", "duration": "2 sec" },
    { "id": 25, "type": "image", "url": "https://picsum.photos/300/200?random=13" },
    { "id": 26, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_5mb.mp4", "duration": "5 sec" },
    { "id": 27, "type": "image", "url": "https://picsum.photos/300/200?random=14" },
    { "id": 28, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4", "duration": "2 sec" },
    { "id": 29, "type": "image", "url": "https://picsum.photos/300/200?random=15" },
    { "id": 30, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_3mb.mp4", "duration": "4 sec" },
    { "id": 31, "type": "image", "url": "https://picsum.photos/300/200?random=16" },
    { "id": 32, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_4mb.mp4", "duration": "5 sec" },
    { "id": 33, "type": "image", "url": "https://picsum.photos/300/200?random=17" },
    { "id": 34, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_2mb.mp4", "duration": "3 sec" },
    { "id": 35, "type": "image", "url": "https://picsum.photos/300/200?random=18" },
    { "id": 36, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_5mb.mp4", "duration": "4 sec" },
    { "id": 37, "type": "image", "url": "https://picsum.photos/300/200?random=19" },
    { "id": 38, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4", "duration": "2 sec" },
    { "id": 39, "type": "image", "url": "https://picsum.photos/300/200?random=20" },
    { "id": 40, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_3mb.mp4", "duration": "3 sec" },
    { "id": 41, "type": "image", "url": "https://picsum.photos/300/200?random=21" },
    { "id": 42, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_4mb.mp4", "duration": "5 sec" },
    { "id": 43, "type": "image", "url": "https://picsum.photos/300/200?random=22" },
    { "id": 44, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_2mb.mp4", "duration": "2 sec" },
    { "id": 45, "type": "image", "url": "https://picsum.photos/300/200?random=23" },
    { "id": 46, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_5mb.mp4", "duration": "5 sec" },
    { "id": 47, "type": "image", "url": "https://picsum.photos/300/200?random=24" },
    { "id": 48, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4", "duration": "2 sec" },
    { "id": 49, "type": "image", "url": "https://picsum.photos/300/200?random=25" },
    { "id": 50, "type": "video", "url": "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_3mb.mp4", "duration": "4 sec" }
]


export const categories = [
  {
    name:"abc 1",
    selected: false 
  },
  {
    name:"abc 2",
    selected: false 
  },
  {
    name:"abc 3",
    selected: false 
  },
  {
    name:"abc 4",
    selected: false 
  },
  {
    name:"abc 5",
    selected: false 
  },
  {
    name:"abc 6",
    selected: false 
  },
  {
    name:"abc 7",
    selected: false 
  },
  {
    name:"abc 8",
    selected: false 
  },
  {
    name:"abc 9",
    selected: false 
  },
  {
    name:"abc 10",
    selected: false 
  },
]

export const statusArrAdminAllPost = [
  {
      label: 'All',
      query: ""
  },
  {
      label: 'Publish',
      query: "published"
  },
  {
      label: 'Draft',
      query: "draft"
  },
  {
      label: 'Schedule',
      query: "scheduled"
  },
  {
      label: 'Rejected',
      query: "rejected"
  },
  {
      label: 'Await approve',
      query: "awaiting approval"
  },
  {
      label: 'Deleted',
      query: "deleted"
  },
];

export const postStatuEnum = {
  DRAFT : 'draft',
  AWAITING_APPROVAL : 'awaiting approval',
  PUBLISHED : 'published',
  SCHEDULED : 'scheduled',
  REJECTED : 'rejected',
}