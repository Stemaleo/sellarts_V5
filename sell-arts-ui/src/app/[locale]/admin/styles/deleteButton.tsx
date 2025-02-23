import { useRouter } from "next/navigation";
import axios from "axios";
import { AlertDialogAction } from "@/components/ui/alert-dialog";
import { DELETE_STYLE } from "@/actions/mutation/admin/stylesType/deleteMutation";


const DeleteButton = ({ styleId, onDeleteSuccess }: { styleId: number; onDeleteSuccess: () => void }) => {
  const router = useRouter();

  const handleDelete = async () => {
    console.log("StyleId: " + styleId);
    
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_DJ_API_URL || "", {
        query: DELETE_STYLE,
        variables: {
          styles: [styleId],
          detete: true, 
        },
      });

      const { data } = response;
      
      if (data.errors) {
        console.error("Erreur de suppression:", data.errors);
        return;
      }
      console.log(data?.data?.featureUpdateStyleDeletions);

      // Vérifiez si la suppression a été effectuée avec succès
      const success = data?.data?.featureUpdateStyleDeletions?.success;
      
      if (success) {
        onDeleteSuccess();
      }
    } catch (error) {
      console.error("Erreur lors de l'appel à la mutation:", error);
    }
  };

  return (
    <AlertDialogAction onClick={handleDelete}>
      Continue
    </AlertDialogAction>
  );
};

export default DeleteButton;
