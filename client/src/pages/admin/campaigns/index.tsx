import { Button, ButtonGroup, Modal, ModalContent, ModalTitle, TextInput, Title } from "@dataesr/dsfr-plus"
// import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"

import type { CampaignType } from "../../../../../server/src/types/index"

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState<CampaignType[]>([])
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [name] = useState<string>()
  const [shortName] = useState<string>()

  // const { data } = useQuery({
  //   queryKey: ['todos'],
  //   queryFn: () => fetch("/api/admin/campaigns").then((response) => response.json()),
  // })

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
  //   console.log("handleSubmit")
  //   e.preventDefault();
  //   // setErrorMessage("");
  //   // setSuccess(false);

  //   const formData: CampaignType = {
  //     name: name ?? "",
  //     shortName,
  //     status: "test",
  //   };

  //   // const validationErrors = validate(formData);
  //   // setErrors(validationErrors);/

  //   // if (Object.keys(validationErrors).length > 0) {
  //   //   if (validationErrors.name && nameRef.current) {
  //   //     nameRef.current.focus();
  //   //   }
  //   //   return;
  //   // }

  //   const response = await fetch("/api/admin/campaigns", {
  //     body: JSON.stringify(formData),
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     method: "POST",
  //   });

  //   // if (response.ok) {
  //   //   setEmail("");
  //   //   setFonction("");
  //   //   setMessage("");
  //   //   setName("");
  //   //   setOrganisation("");
  //   //   setSuccess(true);

  //   //   if (nameRef.current) {
  //   //     nameRef.current.focus();
  //   //   }

  //   //   setTimeout(() => {
  //   //     setSuccess(false);
  //   //   }, 3000);
  //   // } else {
  //   //   setErrorMessage("Une erreur est survenue lors de l'envoi du message.");
  //   //   setTimeout(() => {
  //   //     setErrorMessage("")
  //   //   }, 3000)
  //   // }
  //   setIsOpen(false)
  //   setName(undefined)
  //   setShortName(undefined)
  }

  useEffect(() => {
    const getData = async () => {
      const response = await fetch("/api/admin/campaigns")
      const campaignsTmp = await response.json()
      setCampaigns(campaignsTmp)
    }
    getData()
  }, [])

  return (
    <>
      <Modal isOpen={isOpen} hide={() => setIsOpen(false)}>
        <ModalTitle>Créer une campagne</ModalTitle>
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <TextInput label="Name" value={name} />
            <TextInput label="Short name" value={shortName} />
            <ButtonGroup isInlineFrom="xs" align="right">
              <Button type="submit">Valider</Button>
            </ButtonGroup>
          </form>
        </ModalContent>
      </Modal>
      <Title className="fr-my-3w">Campagnes</Title>
      <Button className="fr-mb-2w" onClick={(e) => { e.preventDefault(); setIsOpen(true) }}>
        Nouvelle campagne
      </Button>
      <table className="fr-table">
        <thead>
          <tr>
            <th>_id</th>
            <th>name</th>
            <th>shortname</th>
            <th>status</th>
            <th>type</th>
            <th>validation</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign: CampaignType) => (
            <tr key={campaign._id}>
              <td>{campaign._id}</td>
              <td>{campaign?.name}</td>
              <td>{campaign?.shortname}</td>
              <td>{campaign?.status}</td>
              <td>{campaign?.type}</td>
              <td>{campaign?.validation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}