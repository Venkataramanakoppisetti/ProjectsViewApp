import './index.css'

const ProjectShowCase = props => {
  const {projectDetails} = props
  const {name, imageUrl} = projectDetails
  return (
    <li className="project-list-item">
      <img src={imageUrl} className="project-image" alt={name} />
      <p className="project-name">{name}</p>
    </li>
  )
}

export default ProjectShowCase
