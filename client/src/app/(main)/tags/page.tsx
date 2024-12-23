import React from 'react'

const page = () => {

    const tagsdata = [
        "Technology",
        "Web Development",
        "Programming",
        "JavaScript",
        "ReactJS",
        "Next.js",
        "Frontend Development",
        "Backend Development",
        "CSS",
        "HTML",
        "UI/UX Design",
        "Node.js",
        "Python",
        "Data Science",
        "Machine Learning",
        "Artificial Intelligence",
        "Cloud Computing",
        "DevOps",
        "Cybersecurity",
        "Mobile Development",
        "iOS Development",
        "Android Development",
        "React Native",
        "Blockchain",
        "Cryptocurrency",
        "Digital Marketing",
        "SEO",
        "Content Marketing",
        "Social Media",
        "E-commerce",
        "Business",
        "Entrepreneurship",
        "Leadership",
        "Productivity",
        "Self Improvement",
        "Motivation",
        "Health & Wellness",
        "Fitness",
        "Nutrition",
        "Mental Health",
        "Lifestyle",
        "Personal Finance",
        "Investing",
        "Real Estate",
        "Travel",
        "Food & Drink",
        "Recipes",
        "Parenting",
        "Education",
        "Photography",
        "Art & Culture"
    ]


    return (
        <div className='p-2 sm:p-5 md:p-10'>
            <h2 className='text-3xl md:text-5xl mt-2 mb-5 font-bold'>Tags</h2>

            <div className='w-full flex flex-row gap-0 sm:gap-2 flex-wrap'>
                {
                    tagsdata.map((tag, index) => (
                        <div key={index} className='text-nowrap text-sm sm:text-base p-2 border-[1px] border-gray-800 rounded-lg m-1 '>
                            <p>{tag}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default page