import React from 'react'
import ContributorCardsRow from './contributorCardsRow'
import ContributorRecentPosts from './contributorRecentPosts'

const ContributorDashboard = () => {
  return (
    <div className='w-full container mx-auto'>
        <ContributorCardsRow/>
        <ContributorRecentPosts/>
    </div>
  )
}

export default ContributorDashboard